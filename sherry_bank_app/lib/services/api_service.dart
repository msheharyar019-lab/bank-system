import 'dart:convert';
import 'package:http/http.dart' as http;
import '../core/constants/api_endpoints.dart';
import '../models/user_profile.dart';
import '../models/transaction_item.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  String currentBaseUrl = ApiEndpoints.baseUrl;

  void setCustomBaseUrl(String url) {
    currentBaseUrl = url;
  }

  // 1. Health check (Handshake test)
  Future<Map<String, dynamic>> checkHealth() async {
    try {
      final res = await http.get(Uri.parse('$currentBaseUrl${ApiEndpoints.health}')).timeout(
        const Duration(seconds: 4),
      );
      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      }
      return {'status': 'ERROR', 'message': 'HTTP ${res.statusCode}'};
    } catch (e) {
      // Try localhost fallback if on desktop or web
      try {
        final fallbackRes = await http
            .get(Uri.parse('${ApiEndpoints.localhostBase}${ApiEndpoints.health}'))
            .timeout(const Duration(seconds: 2));
        if (fallbackRes.statusCode == 200) {
          currentBaseUrl = ApiEndpoints.localhostBase;
          return jsonDecode(fallbackRes.body);
        }
      } catch (_) {}
      return {'status': 'OFFLINE', 'error': e.toString()};
    }
  }

  // 2. Fetch User Profile
  Future<UserProfile?> getProfile() async {
    try {
      final res = await http.get(Uri.parse('$currentBaseUrl${ApiEndpoints.profile}')).timeout(
        const Duration(seconds: 5),
      );
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data['success'] == true) {
          return UserProfile.fromJson(data['data']);
        }
      }
    } catch (_) {}
    return null;
  }

  // 3. Fetch Transaction History
  Future<List<TransactionItem>> getTransactions() async {
    try {
      final res = await http.get(Uri.parse('$currentBaseUrl${ApiEndpoints.transactions}')).timeout(
        const Duration(seconds: 5),
      );
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data['success'] == true && data['data'] is List) {
          return (data['data'] as List)
              .map((item) => TransactionItem.fromJson(item))
              .toList();
        }
      }
    } catch (_) {}
    return [];
  }

  // 4. Send Money
  Future<Map<String, dynamic>> sendMoney({
    required String recipient,
    required double amount,
    String? note,
  }) async {
    try {
      final res = await http.post(
        Uri.parse('$currentBaseUrl${ApiEndpoints.transfer}'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'recipient': recipient,
          'amount': amount,
          'note': note ?? '',
        }),
      );
      return jsonDecode(res.body);
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  // 5. Initiate Easypaisa Mobile Account (MA)
  Future<Map<String, dynamic>> initiateEasypaisaMA({
    required double amount,
    required String mobileAccountNo,
  }) async {
    try {
      final res = await http.post(
        Uri.parse('$currentBaseUrl${ApiEndpoints.epInitiateMA}'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'amount': amount,
          'mobileAccountNo': mobileAccountNo,
        }),
      );
      return jsonDecode(res.body);
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  // 6. Mock Top-up / Instant Deposit
  Future<Map<String, dynamic>> mockDeposit({
    required double amount,
    String source = 'Direct Top-up',
  }) async {
    try {
      final res = await http.post(
        Uri.parse('$currentBaseUrl${ApiEndpoints.mockDeposit}'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'amount': amount,
          'source': source,
        }),
      );
      return jsonDecode(res.body);
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }
}
