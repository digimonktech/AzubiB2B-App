import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

import Firebase
import UserNotifications


@main
class AppDelegate: RCTAppDelegate, UNUserNotificationCenterDelegate {

  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil
  ) -> Bool {

    // 🔥 Initialize Firebase (MANDATORY)
    if FirebaseApp.app() == nil {
      FirebaseApp.configure()
    }

    // 🔔 Notification delegate
    UNUserNotificationCenter.current().delegate = self

    application.registerForRemoteNotifications()

    self.moduleName = "jobB2B"
    self.dependencyProvider = RCTAppDependencyProvider()
    self.initialProps = [:]

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  // ✅ Required for FCM token
  override func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
    Messaging.messaging().apnsToken = deviceToken
  }

  // ❌ APNs registration failed
  override func application(
    _ application: UIApplication,
    didFailToRegisterForRemoteNotificationsWithError error: Error
  ) {
    print("Failed to register for remote notifications:", error)
  }

  // 🔔 Show notification while app is in foreground
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    completionHandler([.banner, .sound, .badge])
  }

  // 🔗 Deep link handler
  override func application(
    _ application: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey : Any] = [:]
  ) -> Bool {
    return RCTLinkingManager.application(application, open: url, options: options)
  }

  // 🔗 Universal links / cold start
  override func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    return RCTLinkingManager.application(
      application,
      continue: userActivity,
      restorationHandler: restorationHandler
    )
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    return self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}



// import UIKit
// import React
// import React_RCTAppDelegate
// import ReactAppDependencyProvider


// @main
// class AppDelegate: RCTAppDelegate {

//   override func application(
//     _ application: UIApplication,
//     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil
//   ) -> Bool {

//     self.moduleName = "jobB2B"
//     self.dependencyProvider = RCTAppDependencyProvider()
//     self.initialProps = [:]

//     return super.application(application, didFinishLaunchingWithOptions: launchOptions)
//   }

//   // 🔗 Deep link handler (custom scheme: jobb2b://)
//   override func application(
//     _ application: UIApplication,
//     open url: URL,
//     options: [UIApplication.OpenURLOptionsKey : Any] = [:]
//   ) -> Bool {
//     return RCTLinkingManager.application(application, open: url, options: options)
//   }

//   // 🔗 Universal links / background / cold start
//   override func application(
//     _ application: UIApplication,
//     continue userActivity: NSUserActivity,
//     restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
//   ) -> Bool {
//     return RCTLinkingManager.application(
//       application,
//       continue: userActivity,
//       restorationHandler: restorationHandler
//     )
//   }

//   override func sourceURL(for bridge: RCTBridge) -> URL? {
//     return self.bundleURL()
//   }

//   override func bundleURL() -> URL? {
// #if DEBUG
//     return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
// #else
//     return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
// #endif
//   }
// }

