# React Native rules
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep our own classes
-keep class com.yourpackagename.** { *; }

# Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# Rules for React Native Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Rules for React Native Navigation
-keep class com.facebook.react.modules.** { *; }

# For Firebase (if you're using it)
-keep class io.invertase.firebase.** { *; }
-dontwarn io.invertase.firebase.**

# For WebRTC (if you're using it)
-keep class org.webrtc.** { *; }

# Keep JavaScript callbacks
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}

# Keep custom native modules
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod *;
}

# For enum classes
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Okhttp rules
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase
-dontwarn okhttp3.internal.platform.**
-dontwarn org.conscrypt.**

# JSR 305 annotations
-dontwarn javax.annotation.**

# For SQLite (if you're using it)
-keep class org.sqlite.** { *; }
-keep class org.sqlite.database.** { *; }