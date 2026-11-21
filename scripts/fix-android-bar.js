const fs = require('fs');
const path = require('path');

// 1. Update styles.xml for all Android themes
const stylesPath = path.join('android', 'app', 'src', 'main', 'res', 'values', 'styles.xml');
if (fs.existsSync(stylesPath)) {
  let xml = fs.readFileSync(stylesPath, 'utf8');
  xml = xml.replace(/<item name="android:statusBarColor">.*?<\/item>/g, '');
  xml = xml.replace(/<item name="statusBarColor">.*?<\/item>/g, '');
  xml = xml.replace(/<item name="android:windowLightStatusBar">.*?<\/item>/g, '');
  xml = xml.replace(/<item name="windowLightStatusBar">.*?<\/item>/g, '');
  xml = xml.replace(/<item name="android:navigationBarColor">.*?<\/item>/g, '');
  xml = xml.replace(/<item name="android:windowLightNavigationBar">.*?<\/item>/g, '');

  const items = [
    '    <item name="android:statusBarColor">#0b0e17</item>',
    '    <item name="statusBarColor">#0b0e17</item>',
    '    <item name="android:windowLightStatusBar">false</item>',
    '    <item name="windowLightStatusBar">false</item>',
    '    <item name="android:navigationBarColor">#0b0e17</item>',
    '    <item name="android:windowLightNavigationBar">false</item>'
  ].join('\n');

  xml = xml.replace(/<\/style>/g, `${items}\n  </style>`);
  fs.writeFileSync(stylesPath, xml, 'utf8');
}

// 2. Patch MainActivity.java so status bar stays #0b0e17 with white icons on all Android versions
const mainActivityPath = path.join('android', 'app', 'src', 'main', 'java', 'com', 'boss777', 'hub', 'MainActivity.java');
if (fs.existsSync(mainActivityPath)) {
  let javaCode = fs.readFileSync(mainActivityPath, 'utf8');

  if (!javaCode.includes('WindowInsetsControllerCompat')) {
    javaCode = javaCode.replace(
      'import com.getcapacitor.BridgeActivity;',
      [
        'import com.getcapacitor.BridgeActivity;',
        'import android.graphics.Color;',
        'import android.os.Build;',
        'import android.os.Bundle;',
        'import android.view.View;',
        'import android.view.Window;',
        'import android.view.WindowManager;',
        'import androidx.core.view.WindowCompat;',
        'import androidx.core.view.WindowInsetsControllerCompat;'
      ].join('\n')
    );

    const barHelper = `
  private void applyBoss777DarkBars() {
    try {
      Window window = getWindow();
      if (window == null) return;
      WindowCompat.setDecorFitsSystemWindows(window, true);
      window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
      window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
      int darkColor = Color.parseColor("#0b0e17");
      window.setStatusBarColor(darkColor);
      window.setNavigationBarColor(darkColor);

      View decorView = window.getDecorView();
      WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, decorView);
      if (controller != null) {
        controller.setAppearanceLightStatusBars(false);
        controller.setAppearanceLightNavigationBars(false);
      }
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && decorView != null) {
        int vis = decorView.getSystemUiVisibility();
        vis &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
        decorView.setSystemUiVisibility(vis);
      }
    } catch (Exception ignored) {}
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    applyBoss777DarkBars();
  }

  @Override
  public void onResume() {
    super.onResume();
    applyBoss777DarkBars();
  }
`;

    javaCode = javaCode.replace(/\}\s*$/, `${barHelper}\n}\n`);
    fs.writeFileSync(mainActivityPath, javaCode, 'utf8');
  }
}
