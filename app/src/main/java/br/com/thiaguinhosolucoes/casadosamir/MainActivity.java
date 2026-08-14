package br.com.thiaguinhosolucoes.casadosamir;

import android.app.Activity;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.provider.MediaStore;
import android.util.Base64;
import android.view.Window;
import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.core.content.FileProvider;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewClientCompat;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends Activity {

    private static final int FILE_CHOOSER_REQUEST = 9042;
    private WebView webView;
    private ValueCallback<Uri[]> fileChooserCallback;
    private long lastBackPressedAt = 0L;
    private Object backInvokedCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        window.setStatusBarColor(Color.rgb(15, 23, 42));
        window.setNavigationBarColor(Color.rgb(15, 23, 42));

        webView = new WebView(this);
        setContentView(webView);

        configureWebView();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            backInvokedCallback = BackApi33.register(this, this::handleBackPressed);
        }
    }

    private void configureWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setSupportZoom(false);
        settings.setTextZoom(100);
        settings.setUserAgentString(settings.getUserAgentString() + " CasaDoSamir/1.0");

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            settings.setSafeBrowsingEnabled(true);
        }

        WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        webView.setWebViewClient(new LocalWebViewClient(assetLoader));
        webView.setWebChromeClient(new AppWebChromeClient());
        webView.addJavascriptInterface(new AndroidBridge(this), "AndroidApp");
        webView.loadUrl("https://appassets.androidplatform.net/assets/index.html");
    }

    private class LocalWebViewClient extends WebViewClientCompat {
        private final WebViewAssetLoader loader;

        LocalWebViewClient(WebViewAssetLoader loader) {
            this.loader = loader;
        }

        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            return loader.shouldInterceptRequest(request.getUrl());
        }

        @SuppressWarnings("deprecation")
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
            return loader.shouldInterceptRequest(Uri.parse(url));
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            if ("appassets.androidplatform.net".equalsIgnoreCase(uri.getHost())) {
                return false;
            }
            openExternal(uri);
            return true;
        }

        @SuppressWarnings("deprecation")
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            Uri uri = Uri.parse(url);
            if ("appassets.androidplatform.net".equalsIgnoreCase(uri.getHost())) {
                return false;
            }
            openExternal(uri);
            return true;
        }

        @Override
        public boolean onRenderProcessGone(WebView view, android.webkit.RenderProcessGoneDetail detail) {
            Toast.makeText(MainActivity.this, "A tela foi reiniciada com segurança.", Toast.LENGTH_SHORT).show();
            recreate();
            return true;
        }
    }

    private class AppWebChromeClient extends WebChromeClient {
        @Override
        public boolean onShowFileChooser(
                WebView webView,
                ValueCallback<Uri[]> filePathCallback,
                FileChooserParams fileChooserParams
        ) {
            if (fileChooserCallback != null) {
                fileChooserCallback.onReceiveValue(null);
            }
            fileChooserCallback = filePathCallback;

            Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            intent.setType("application/json");
            try {
                startActivityForResult(intent, FILE_CHOOSER_REQUEST);
                return true;
            } catch (Exception ex) {
                fileChooserCallback = null;
                Toast.makeText(MainActivity.this, "Não foi possível abrir o seletor de arquivos.", Toast.LENGTH_SHORT).show();
                return false;
            }
        }
    }

    @Override
    @SuppressWarnings("deprecation")
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != FILE_CHOOSER_REQUEST || fileChooserCallback == null) return;

        Uri[] result = null;
        if (resultCode == RESULT_OK && data != null && data.getData() != null) {
            result = new Uri[]{data.getData()};
        }
        fileChooserCallback.onReceiveValue(result);
        fileChooserCallback = null;
    }

    private void openExternal(Uri uri) {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            startActivity(intent);
        } catch (Exception ex) {
            Toast.makeText(this, "Nenhum aplicativo disponível para abrir este link.", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            handleBackPressed();
        }
    }

    private void handleBackPressed() {
        if (webView == null) {
            finish();
            return;
        }

        webView.evaluateJavascript(
                "(window.CasaDoSamirBack ? window.CasaDoSamirBack() : false)",
                value -> {
                    if ("true".equals(value)) return;

                    long now = System.currentTimeMillis();
                    if (now - lastBackPressedAt <= 1800L) {
                        finish();
                        return;
                    }
                    lastBackPressedAt = now;
                    Toast.makeText(MainActivity.this, "Voltar novamente para sair", Toast.LENGTH_SHORT).show();
                }
        );
    }

    @Override
    protected void onDestroy() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && backInvokedCallback != null) {
            BackApi33.unregister(this, backInvokedCallback);
        }
        if (webView != null) {
            webView.removeJavascriptInterface("AndroidApp");
            webView.destroy();
        }
        super.onDestroy();
    }


    private static class BackApi33 {
        static Object register(Activity activity, Runnable action) {
            OnBackInvokedCallback callback = action::run;
            activity.getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                    OnBackInvokedDispatcher.PRIORITY_DEFAULT,
                    callback
            );
            return callback;
        }

        static void unregister(Activity activity, Object callback) {
            if (callback instanceof OnBackInvokedCallback) {
                activity.getOnBackInvokedDispatcher().unregisterOnBackInvokedCallback(
                        (OnBackInvokedCallback) callback
                );
            }
        }
    }

    public class AndroidBridge {
        private static final String PREFS = "casa_do_samir_prefs";
        private static final String STATE_FILE = "apartamentos.json";
        private static final String SETTINGS_FILE = "configuracoes.json";
        private static final String MIRROR_URI_KEY = "mirror_state_uri";

        private final Context context;
        private final SharedPreferences prefs;

        AndroidBridge(Context context) {
            this.context = context.getApplicationContext();
            this.prefs = context.getSharedPreferences(PREFS, MODE_PRIVATE);
        }

        @JavascriptInterface
        public String loadState() {
            String data = readPrivateFile(STATE_FILE);
            if (data != null && !data.trim().isEmpty()) return data;

            String mirror = readVisibleMirror();
            if (mirror != null && !mirror.trim().isEmpty()) {
                writePrivateFile(STATE_FILE, mirror);
                return mirror;
            }
            return "[]";
        }

        @JavascriptInterface
        public void saveState(String json) {
            if (json == null) return;
            writePrivateFile(STATE_FILE, json);
            writeVisibleMirror(json);
        }

        @JavascriptInterface
        public String loadSettings() {
            String data = readPrivateFile(SETTINGS_FILE);
            return (data == null || data.trim().isEmpty()) ? "{}" : data;
        }

        @JavascriptInterface
        public void saveSettings(String json) {
            if (json == null) return;
            writePrivateFile(SETTINGS_FILE, json);
        }

        @JavascriptInterface
        public String getStorageDescription() {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                return "Downloads/Casa do Samir";
            }
            File dir = new File(context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS), "Casa do Samir");
            return dir.getAbsolutePath();
        }

        @JavascriptInterface
        public void exportTextFile(String filename, String content) {
            try {
                byte[] bytes = content.getBytes(StandardCharsets.UTF_8);
                Uri uri = saveBytesToUserFolder("Backups", filename, "application/json", bytes);
                showToast(uri != null
                        ? "Backup salvo em Downloads/Casa do Samir/Backups."
                        : "Backup salvo no armazenamento do aplicativo.");
            } catch (Exception ex) {
                showToast("Falha ao salvar o backup.");
            }
        }

        @JavascriptInterface
        public void saveBase64File(String filename, String mimeType, String base64) {
            try {
                byte[] bytes = decodeBase64(base64);
                Uri uri = saveBytesToUserFolder("Relatorios", filename, mimeType, bytes);
                showToast(uri != null
                        ? "PDF salvo em Downloads/Casa do Samir/Relatorios."
                        : "PDF salvo no armazenamento do aplicativo.");
            } catch (Exception ex) {
                showToast("Falha ao salvar o arquivo.");
            }
        }

        @JavascriptInterface
        public void shareBase64File(String filename, String mimeType, String base64, String chooserTitle) {
            try {
                byte[] bytes = decodeBase64(base64);
                File shareDir = new File(context.getCacheDir(), "share");
                if (!shareDir.exists()) shareDir.mkdirs();
                File file = new File(shareDir, sanitizeFilename(filename));
                try (FileOutputStream out = new FileOutputStream(file)) {
                    out.write(bytes);
                    out.flush();
                }

                Uri uri = FileProvider.getUriForFile(
                        MainActivity.this,
                        getPackageName() + ".fileprovider",
                        file
                );

                runOnUiThread(() -> {
                    Intent intent = new Intent(Intent.ACTION_SEND);
                    intent.setType(mimeType == null || mimeType.isEmpty() ? "application/octet-stream" : mimeType);
                    intent.putExtra(Intent.EXTRA_STREAM, uri);
                    intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    startActivity(Intent.createChooser(
                            intent,
                            chooserTitle == null || chooserTitle.isEmpty() ? "Compartilhar" : chooserTitle
                    ));
                });
            } catch (Exception ex) {
                showToast("Não foi possível compartilhar o PDF.");
            }
        }

        @JavascriptInterface
        public void shareText(String title, String text) {
            runOnUiThread(() -> {
                Intent intent = new Intent(Intent.ACTION_SEND);
                intent.setType("text/plain");
                intent.putExtra(Intent.EXTRA_SUBJECT, title);
                intent.putExtra(Intent.EXTRA_TEXT, text);
                startActivity(Intent.createChooser(intent, title == null ? "Compartilhar" : title));
            });
        }

        @JavascriptInterface
        public void openUrl(String url) {
            if (url == null || url.trim().isEmpty()) return;
            runOnUiThread(() -> openExternal(Uri.parse(url)));
        }

        @JavascriptInterface
        public void printCurrentPage(String title) {
            runOnUiThread(() -> {
                try {
                    PrintManager printManager = (PrintManager) getSystemService(Context.PRINT_SERVICE);
                    String jobName = (title == null || title.trim().isEmpty()) ? "Casa do Samir" : title;
                    PrintDocumentAdapter adapter = webView.createPrintDocumentAdapter(jobName);
                    printManager.print(jobName, adapter, new PrintAttributes.Builder().build());
                } catch (Exception ex) {
                    Toast.makeText(MainActivity.this, "Não foi possível abrir a impressão.", Toast.LENGTH_SHORT).show();
                }
            });
        }

        private byte[] decodeBase64(String value) {
            if (value == null) return new byte[0];
            int comma = value.indexOf(',');
            String clean = comma >= 0 ? value.substring(comma + 1) : value;
            return Base64.decode(clean, Base64.DEFAULT);
        }

        private File privateDir() {
            File dir = new File(context.getFilesDir(), "CasaDoSamir");
            if (!dir.exists()) dir.mkdirs();
            return dir;
        }

        private String readPrivateFile(String name) {
            File file = new File(privateDir(), name);
            if (!file.exists()) return null;
            try (FileInputStream in = new FileInputStream(file)) {
                return new String(readAllBytes(in), StandardCharsets.UTF_8);
            } catch (Exception ex) {
                return null;
            }
        }

        private void writePrivateFile(String name, String content) {
            File dir = privateDir();
            File target = new File(dir, name);
            File temp = new File(dir, name + ".tmp");
            try (FileOutputStream out = new FileOutputStream(temp)) {
                out.write(content.getBytes(StandardCharsets.UTF_8));
                out.flush();
                out.getFD().sync();
            } catch (Exception ex) {
                temp.delete();
                return;
            }
            if (target.exists() && !target.delete()) {
                temp.delete();
                return;
            }
            if (!temp.renameTo(target)) {
                try (FileInputStream in = new FileInputStream(temp);
                     FileOutputStream out = new FileOutputStream(target)) {
                    byte[] buffer = new byte[8192];
                    int n;
                    while ((n = in.read(buffer)) > 0) out.write(buffer, 0, n);
                } catch (Exception ignored) {
                }
                temp.delete();
            }
        }

        private void writeVisibleMirror(String json) {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
                File base = context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS);
                if (base == null) return;
                File dir = new File(base, "Casa do Samir");
                if (!dir.exists()) dir.mkdirs();
                File file = new File(dir, "dados-apartamentos.json");
                try (FileOutputStream out = new FileOutputStream(file)) {
                    out.write(json.getBytes(StandardCharsets.UTF_8));
                } catch (Exception ignored) {
                }
                return;
            }

            ContentResolver resolver = context.getContentResolver();
            Uri stored = null;
            String storedText = prefs.getString(MIRROR_URI_KEY, null);
            if (storedText != null) {
                try {
                    stored = Uri.parse(storedText);
                    try (OutputStream out = resolver.openOutputStream(stored, "wt")) {
                        if (out != null) {
                            out.write(json.getBytes(StandardCharsets.UTF_8));
                            out.flush();
                            return;
                        }
                    }
                } catch (Exception ignored) {
                    prefs.edit().remove(MIRROR_URI_KEY).apply();
                }
            }

            try {
                ContentValues values = new ContentValues();
                values.put(MediaStore.Downloads.DISPLAY_NAME, "dados-apartamentos.json");
                values.put(MediaStore.Downloads.MIME_TYPE, "application/json");
                values.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/Casa do Samir");
                values.put(MediaStore.Downloads.IS_PENDING, 1);

                Uri uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                if (uri == null) return;
                try (OutputStream out = resolver.openOutputStream(uri, "w")) {
                    if (out != null) {
                        out.write(json.getBytes(StandardCharsets.UTF_8));
                        out.flush();
                    }
                }
                ContentValues publish = new ContentValues();
                publish.put(MediaStore.Downloads.IS_PENDING, 0);
                resolver.update(uri, publish, null, null);
                prefs.edit().putString(MIRROR_URI_KEY, uri.toString()).apply();
            } catch (Exception ignored) {
            }
        }

        private String readVisibleMirror() {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
                File base = context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS);
                if (base == null) return null;
                File file = new File(new File(base, "Casa do Samir"), "dados-apartamentos.json");
                if (!file.exists()) return null;
                try (FileInputStream in = new FileInputStream(file)) {
                    return new String(readAllBytes(in), StandardCharsets.UTF_8);
                } catch (Exception ex) {
                    return null;
                }
            }

            ContentResolver resolver = context.getContentResolver();
            String storedText = prefs.getString(MIRROR_URI_KEY, null);
            if (storedText != null) {
                try (InputStream in = resolver.openInputStream(Uri.parse(storedText))) {
                    if (in != null) return new String(readAllBytes(in), StandardCharsets.UTF_8);
                } catch (Exception ignored) {
                }
            }

            String[] projection = { MediaStore.Downloads._ID };
            String selection = MediaStore.Downloads.DISPLAY_NAME + "=? AND " +
                    MediaStore.Downloads.RELATIVE_PATH + "=?";
            String[] args = {
                    "dados-apartamentos.json",
                    Environment.DIRECTORY_DOWNLOADS + "/Casa do Samir/"
            };

            try (android.database.Cursor cursor = resolver.query(
                    MediaStore.Downloads.EXTERNAL_CONTENT_URI,
                    projection,
                    selection,
                    args,
                    MediaStore.Downloads.DATE_MODIFIED + " DESC"
            )) {
                if (cursor != null && cursor.moveToFirst()) {
                    long id = cursor.getLong(0);
                    Uri uri = Uri.withAppendedPath(MediaStore.Downloads.EXTERNAL_CONTENT_URI, String.valueOf(id));
                    prefs.edit().putString(MIRROR_URI_KEY, uri.toString()).apply();
                    try (InputStream in = resolver.openInputStream(uri)) {
                        if (in != null) return new String(readAllBytes(in), StandardCharsets.UTF_8);
                    }
                }
            } catch (Exception ignored) {
            }
            return null;
        }

        private Uri saveBytesToUserFolder(String subfolder, String filename, String mimeType, byte[] bytes) throws Exception {
            String safe = sanitizeFilename(filename);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                ContentResolver resolver = context.getContentResolver();
                ContentValues values = new ContentValues();
                values.put(MediaStore.Downloads.DISPLAY_NAME, safe);
                values.put(MediaStore.Downloads.MIME_TYPE,
                        mimeType == null || mimeType.isEmpty() ? "application/octet-stream" : mimeType);
                values.put(MediaStore.Downloads.RELATIVE_PATH,
                        Environment.DIRECTORY_DOWNLOADS + "/Casa do Samir/" + subfolder);
                values.put(MediaStore.Downloads.IS_PENDING, 1);
                Uri uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                if (uri == null) throw new IllegalStateException("Falha ao criar arquivo");
                try (OutputStream out = resolver.openOutputStream(uri, "w")) {
                    if (out == null) throw new IllegalStateException("Falha ao abrir arquivo");
                    out.write(bytes);
                    out.flush();
                }
                ContentValues publish = new ContentValues();
                publish.put(MediaStore.Downloads.IS_PENDING, 0);
                resolver.update(uri, publish, null, null);
                return uri;
            }

            File base = context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS);
            if (base == null) base = context.getFilesDir();
            File dir = new File(base, "Casa do Samir/" + subfolder);
            if (!dir.exists()) dir.mkdirs();
            try (FileOutputStream out = new FileOutputStream(new File(dir, safe))) {
                out.write(bytes);
                out.flush();
            }
            return null;
        }

        private String sanitizeFilename(String name) {
            String safe = (name == null || name.trim().isEmpty()) ? "arquivo" : name;
            return safe.replaceAll("[\\\\/:*?\"<>|]", "-");
        }

        private byte[] readAllBytes(InputStream input) throws Exception {
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            byte[] data = new byte[8192];
            int n;
            while ((n = input.read(data)) != -1) {
                buffer.write(data, 0, n);
            }
            return buffer.toByteArray();
        }

        private void showToast(String message) {
            runOnUiThread(() -> Toast.makeText(MainActivity.this, message, Toast.LENGTH_LONG).show());
        }
    }
}
