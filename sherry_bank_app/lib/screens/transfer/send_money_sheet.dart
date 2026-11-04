import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../services/api_service.dart';

class SendMoneySheet extends StatefulWidget {
  final VoidCallback onTransferSuccess;

  const SendMoneySheet({super.key, required this.onTransferSuccess});

  @override
  State<SendMoneySheet> createState() => _SendMoneySheetState();
}

class _SendMoneySheetState extends State<SendMoneySheet> {
  final _recipientController = TextEditingController(text: '03019876543');
  final _amountController = TextEditingController(text: '1000');
  final _noteController = TextEditingController(text: 'Monthly Expense');
  bool _isLoading = false;
  String? _errorMessage;

  Future<void> _handleTransfer() async {
    final recipient = _recipientController.text.trim();
    final amount = double.tryParse(_amountController.text.trim()) ?? 0;

    if (recipient.isEmpty) {
      setState(() => _errorMessage = 'Please enter recipient number');
      return;
    }
    if (amount <= 0) {
      setState(() => _errorMessage = 'Enter a valid transfer amount');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final res = await ApiService().sendMoney(
      recipient: recipient,
      amount: amount,
      note: _noteController.text.trim(),
    );

    setState(() => _isLoading = false);

    if (res['success'] == true) {
      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: AppColors.primary,
            content: Text('Successfully transferred Rs. ${amount.toStringAsFixed(0)} to $recipient'),
          ),
        );
        widget.onTransferSuccess();
      }
    } else {
      setState(() {
        _errorMessage = res['message'] ?? 'Transfer failed. Check balance or server.';
      });
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
              const Text(
                'Send Money',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close, color: AppColors.textMuted),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (_errorMessage != null)
            Container(
              padding: const EdgeInsets.all(12),
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: AppColors.danger.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppColors.danger.withOpacity(0.3)),
              ),
              child: Text(
                _errorMessage!,
                style: const TextStyle(color: AppColors.danger, fontSize: 13),
              ),
            ),
          TextField(
            controller: _recipientController,
            keyboardType: TextInputType.phone,
            decoration: InputDecoration(
              labelText: 'Recipient Phone or Account #',
              prefixIcon: const Icon(Icons.phone_android, color: AppColors.primary),
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
              labelText: 'Amount (PKR)',
              prefixIcon: const Icon(Icons.monetization_on_outlined, color: AppColors.accentGold),
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
            controller: _noteController,
            decoration: InputDecoration(
              labelText: 'Note / Purpose (Optional)',
              prefixIcon: const Icon(Icons.description_outlined, color: AppColors.textMuted),
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
            height: 52,
            child: ElevatedButton(
              onPressed: _isLoading ? null : _handleTransfer,
              child: _isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                    )
                  : const Text('Confirm & Send Money'),
            ),
          ),
        ],
      ),
    );
  }
}
