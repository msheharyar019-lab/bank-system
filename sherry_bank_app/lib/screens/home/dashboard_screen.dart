import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../models/user_profile.dart';
import '../../models/transaction_item.dart';
import '../../services/api_service.dart';
import '../../widgets/balance_card.dart';
import '../../widgets/quick_action_item.dart';
import '../../widgets/transaction_tile.dart';
import '../transfer/send_money_sheet.dart';
import '../deposit/easypaisa_deposit_sheet.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final ApiService _api = ApiService();
  UserProfile? _profile;
  List<TransactionItem> _transactions = [];
  bool _isLoading = true;
  String _serverStatus = 'CHECKING';

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    setState(() => _isLoading = true);

    // 1. Check server health
    final health = await _api.checkHealth();
    final isOnline = health['status'] == 'ONLINE';

    // 2. Fetch profile & transactions
    final profile = await _api.getProfile();
    final txns = await _api.getTransactions();

    if (mounted) {
      setState(() {
        _serverStatus = isOnline ? 'ONLINE' : 'OFFLINE';
        _profile = profile ??
            UserProfile(
              userId: 'user_sherry_001',
              accountNumber: 'PK88SHRY00192837465',
              holderName: 'Sheharyar Khan',
              phoneNumber: '03001234567',
              balance: 75000.0,
              currency: 'PKR',
              tier: 'Enterprise Verified',
            );
        _transactions = txns;
        _isLoading = false;
      });
    }
  }

  void _openSendMoneySheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (_) => SendMoneySheet(onTransferSuccess: _loadDashboardData),
    );
  }

  void _openEasypaisaDepositSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (_) => EasypaisaDepositSheet(onDepositSuccess: _loadDashboardData),
    );
  }

  void _showComingSoon(String feature) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: AppColors.surfaceLight,
        content: Text('$feature module is active in enterprise mode.'),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadDashboardData,
          color: AppColors.primary,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top App Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        CircleAvatar(
                          radius: 22,
                          backgroundColor: AppColors.surfaceLight,
                          child: const Icon(Icons.person, color: Colors.white, size: 24),
                        ),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Assalam-o-Alaikum,',
                              style: TextStyle(
                                fontSize: 12,
                                color: AppColors.textSecondary,
                              ),
                            ),
                            Text(
                              _profile?.holderName ?? 'Sheharyar',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),

                    // Server Health Status Badge
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: _serverStatus == 'ONLINE'
                            ? AppColors.primary.withOpacity(0.15)
                            : AppColors.danger.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: _serverStatus == 'ONLINE'
                              ? AppColors.primary.withOpacity(0.4)
                              : AppColors.danger.withOpacity(0.4),
                          width: 1,
                        ),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: _serverStatus == 'ONLINE'
                                  ? AppColors.primary
                                  : AppColors.danger,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            _serverStatus == 'ONLINE' ? 'API LIVE' : 'OFFLINE',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: _serverStatus == 'ONLINE'
                                  ? AppColors.primary
                                  : AppColors.danger,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 20),

                // Main Luxury Balance Card
                BalanceCard(
                  balance: _profile?.balance ?? 0.0,
                  accountNumber: _profile?.accountNumber ?? '',
                  holderName: _profile?.holderName ?? '',
                  tier: _profile?.tier ?? 'Verified',
                  onAddMoneyPressed: _openEasypaisaDepositSheet,
                ),

                const SizedBox(height: 24),

                // Quick Action Hub
                const Text(
                  'Quick Services',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 14),

                Row(
                  children: [
                    Expanded(
                      child: QuickActionItem(
                        icon: Icons.send_rounded,
                        label: 'Send Money',
                        color: AppColors.accentCyan,
                        onTap: _openSendMoneySheet,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: QuickActionItem(
                        icon: Icons.payments_rounded,
                        label: 'Easypaisa',
                        color: AppColors.primary,
                        isBadge: true,
                        onTap: _openEasypaisaDepositSheet,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: QuickActionItem(
                        icon: Icons.receipt_long_rounded,
                        label: 'Bill Pay',
                        color: AppColors.accentGold,
                        onTap: () => _showComingSoon('Utility Bill Payment (1Link/UBPS)'),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: QuickActionItem(
                        icon: Icons.account_balance_rounded,
                        label: 'Raast Pay',
                        color: Colors.purpleAccent,
                        onTap: () => _showComingSoon('SBP Raast Instant Transfer'),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 28),

                // Recent Transactions Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Recent Activity',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    TextButton(
                      onPressed: _loadDashboardData,
                      child: const Text(
                        'Refresh',
                        style: TextStyle(color: AppColors.primary, fontSize: 13),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // Transactions List
                if (_isLoading)
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.all(30.0),
                      child: CircularProgressIndicator(color: AppColors.primary),
                    ),
                  )
                else if (_transactions.isEmpty)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Center(
                      child: Text(
                        'No transactions recorded yet.',
                        style: TextStyle(color: AppColors.textMuted),
                      ),
                    ),
                  )
                else
                  ..._transactions.map((tx) => TransactionTile(transaction: tx)),

                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
