import 'package:flutter/foundation.dart';

class ApiEndpoints {
  // Configurable backend URL
  // Windows Desktop / Chrome / iOS Simulator: http://localhost:5000
  // Android Emulator: http://10.0.2.2:5000
  // Physical device: Use local LAN IP or 'adb reverse tcp:5000 tcp:5000'
  static String get baseUrl {
    if (kIsWeb) return 'http://localhost:5000/api';
    if (defaultTargetPlatform == TargetPlatform.android) {
      // Default to localhost with adb reverse, or fallback
      return 'http://10.0.2.2:5000/api';
    }
    return 'http://localhost:5000/api';
  }

  // Fallback direct localhost for desktop & web
  static const String localhostBase = 'http://localhost:5000/api';

  static const String health = '/health';
  static const String profile = '/wallet/profile';
  static const String transactions = '/wallet/transactions';
  static const String transfer = '/wallet/transfer';
  static const String mockDeposit = '/wallet/mock-deposit';
  
  // Easypaisa REST endpoints (via Sherry Bank Backend Gateway)
  static const String epInitiateMA = '/easypaisa/initiate-ma';
  static const String epInitiateOTC = '/easypaisa/initiate-otc';
  static const String epInquire = '/easypaisa/inquire';
}
