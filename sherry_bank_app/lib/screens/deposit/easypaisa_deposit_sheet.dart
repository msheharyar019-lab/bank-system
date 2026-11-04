import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../services/api_service.dart';

class EasypaisaDepositSheet extends StatefulWidget {
  final VoidCallback onDepositSuccess;

  const EasypaisaDepositSheet({super.key, required this.onDepositSuccess});

  @override
  State<EasypaisaDepositSheet> createState() => _EasypaisaDepositSheetState();
}

class _EasypaisaDepositSheetState extends State<EasypaisaDepositSheet> {
  final _mobileAccountController = TextEditingController(text: '03458508726');
  final _amountController = TextEditingController(text: '500');
  bool _isLoading = false;
  String? _statusMessage;
  bool _isSuccess = false;

  // Real Easypaisa Mobile Account API Call
  Future<void> _handleEasypaisaMA() async {
    final phone = _mobileAccountController.text.trim();
    final amount = double.tryParse(_amountController.text.trim()) ?? 0;

    if (phone.length < 11) {
      setState(() {
        _statusMessage = 'Enter valid 11-digit Easypaisa number (03xxxxxxxxx)';
        _isSuccess = false;
      });
      return;
    }
    if (amount <= 0) {
      setState(() {
        _statusMessage = 'Enter a valid amount';
        _isSuccess = false;
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _statusMessage = null;
    });

    final res = await ApiService().initiateEasypaisaMA(
      amount: amount,
      mobileAccountNo: phone,
    );

    setState(() => _isLoading = false);

    if (res['success'] == true) {
      setState(() {
        _isSuccess = true;
        _statusMessage = 'Easypaisa MA Request sent! Order ID: ${res['orderId']}\nCheck your Easypaisa phone for MPIN approval prompt.';
      });
      widget.onDepositSuccess();
    } else {
      final msg = res['result']?['responseDesc'] ?? res['message'] ?? 'Gateway request completed.';
      setState(() {
        _isSuccess = false;
        _statusMessage = 'Easypaisa Gateway Response: $msg';
      });
    }
  }

  // Instant Demo Top-up (For immediate testing)
  Future<void> _handleInstantDemoTopup() async {
    final amount = double.tryParse(_amountController.text.trim()) ?? 500;
    setState(() => _isLoading = true);

    final res = await ApiService().mockDeposit(
      amount: amount,
      source: 'Easypaisa Instant Top-up (Demo)',
    );

    setState(() => _isLoading = false);

    if (res['success'] == true) {
      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: AppColors.primary,
            content: Text('Successfully deposited Rs. ${amount.toStringAsFixed(0)} to Sherry Bank!'),
          ),
        );
        widget.onDepositSuccess();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 24,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text(
                      'EASYPAISA',
                      style: TextStyle(
                        color: AppColors.primary,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    'Add Money',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
              IconButton(
                icon: const Icon(Icons.close, color: AppColors.textMuted),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Text(
            'Deposit funds using your Easypaisa Mobile Account via Sherry Bank API Gateway.',
            style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
          ),
          const SizedBox(height: 16),
          if (_statusMessage != null)
            Container(
              padding: const EdgeInsets.all(12),
              margin: const EdgeInsets.only(bottom: 14),
              decoration: BoxDecoration(
                color: _isSuccess
                    ? AppColors.primary.withOpacity(0.12)
                    : AppColors.danger.withOpacity(0.12),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: _isSuccess
                      ? AppColors.primary.withOpacity(0.3)
                      : AppColors.danger.withOpacity(0.3),
                ),
              ),
              child: Text(
                _statusMessage!,
                style: TextStyle(
                  color: _isSuccess ? AppColors.primary : AppColors.danger,
                  fontSize: 12,
                ),
              ),
            ),
          TextField(
            controller: _mobileAccountController,
            keyboardType: TextInputType.phone,
            decoration: InputDecoration(
              labelText: 'Easypaisa Mobile # (03xxxxxxxxx)',
              prefixIcon: const Icon(Icons.phone_iphone, color: AppColors.primary),
              filled: true,
              fillColor: AppColors.surface,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(14),
                borderSide: BorderSide.none,
              ),
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _amountController,
            keyboardType: TextInputType.number,
            decoration: InputDecoration(
              labelText: 'Deposit Amount (PKR)',
              prefixIcon: const Icon(Icons.account_balance_wallet_outlined, color: AppColors.accentGold),
              filled: true,
              fillColor: AppColors.surface,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(14),
                borderSide: BorderSide.none,
              ),
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              onPressed: _isLoading ? null : _handleEasypaisaMA,
              child: _isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                    )
                  : const Text('Initiate Easypaisa MA Request'),
            ),
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            height: 44,
            child: OutlinedButton(
              onPressed: _isLoading ? null : _handleInstantDemoTopup,
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: AppColors.accentGold.withOpacity(0.5)),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: const Text(
                '⚡ Instant Test Top-up (Fast Demo)',
                style: TextStyle(color: AppColors.accentGold, fontSize: 13, fontWeight: FontWeight.w600),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
