"""Adds Android TV support to the Capacitor Android project (run after `npx cap sync android`)."""
import os, shutil
p = 'android/app/src/main/AndroidManifest.xml'
s = open(p, encoding='utf-8').read()
if 'android.software.leanback' not in s:
    s = s.replace('<application',
        '<uses-feature android:name="android.software.leanback" android:required="false" />\n'
        '    <uses-feature android:name="android.hardware.touchscreen" android:required="false" />\n'
        '    <uses-feature android:name="android.hardware.faketouch" android:required="false" />\n'
        '    <application android:banner="@drawable/banner"', 1)
    s = s.replace('<category android:name="android.intent.category.LAUNCHER" />',
        '<category android:name="android.intent.category.LAUNCHER" />\n'
        '                <category android:name="android.intent.category.LEANBACK_LAUNCHER" />', 1)
    open(p, 'w', encoding='utf-8').write(s)
d = 'android/app/src/main/res/drawable-xhdpi'
os.makedirs(d, exist_ok=True)
shutil.copy('assets/tv-banner.png', os.path.join(d, 'banner.png'))
print('Android TV support added')
