import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../home/dashboard_screen.dart';

class MpinScreen extends StatefulWidget {
  const MpinScreen({super.key});

  @override
  State<MpinScreen> createState() => _MpinScreenState();
}

class _MpinScreenState extends State<MpinScreen> {
  String _pin = '';

  void _onKeyPress(String val) {
    if (_pin.length < 4) {
      setState(() => _pin += val);
      if (_pin.length == 4) {
        Future.delayed(const Duration(milliseconds: 250), () {
          if (mounted) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (_) => const DashboardScreen()),
            );
          }
        });
      }
    }
  }

  void _onBackspace() {
    if (_pin.isNotEmpty) {
      setState(() => _pin = _pin.substring(0, _pin.length - 1));
    }
  }

  Widget _buildKey(String label) {
    return InkWell(
      onTap: () => _onKeyPress(label),
      borderRadius: BorderRadius.circular(40),
      child: Container(
        width: 68,
        height: 68,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: AppColors.surface,
          border: Border.all(color: Colors.white.withValues(alpha: 0.06)),
        ),
        child: Text(
          label,
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: ConstrainedBox(
                constraints: BoxConstraints(minHeight: constraints.maxHeight),
                child: IntrinsicHeight(
                  child: Column(
                    children: [
                      const SizedBox(height: 24),

                      // Sherry Bank Icon & Title
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withValues(alpha: 0.12),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.shield_outlined,
                          color: AppColors.primary,
                          size: 32,
                        ),
                      ),

                      const SizedBox(height: 16),
                      const Text(
                        'Welcome Back',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Enter your 4-digit MPIN for Sheharyar Khan',
                        style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
                      ),

                      const SizedBox(height: 24),

                      // PIN Indicator Dots
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(4, (index) {
                          final isFilled = index < _pin.length;
                          return AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            margin: const EdgeInsets.symmetric(horizontal: 10),
                            width: isFilled ? 18 : 14,
                            height: isFilled ? 18 : 14,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: isFilled ? AppColors.primary : Colors.transparent,
                              border: Border.all(
                                color: isFilled ? AppColors.primary : AppColors.textMuted,
                                width: 2,
                              ),
                              boxShadow: isFilled
                                  ? [
                                      BoxShadow(
                                        color: AppColors.primary.withValues(alpha: 0.6),
                                        blurRadius: 10,
                                      ),
                                    ]
                                  : null,
                            ),
                          );
                        }),
                      ),

                      const Spacer(),

                      // Custom Keypad
                      Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: ['1', '2', '3'].map(_buildKey).toList(),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: ['4', '5', '6'].map(_buildKey).toList(),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: ['7', '8', '9'].map(_buildKey).toList(),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              // Biometric quick login
                              InkWell(
                                onTap: () {
                                  Navigator.pushReplacement(
                                    context,
                                    MaterialPageRoute(builder: (_) => const DashboardScreen()),
                                  );
                                },
                                borderRadius: BorderRadius.circular(40),
                                child: Container(
                                  width: 68,
                                  height: 68,
                                  alignment: Alignment.center,
                                  child: const Icon(Icons.fingerprint, color: AppColors.primary, size: 30),
                                ),
                              ),
                              _buildKey('0'),
                              // Backspace
                              InkWell(
                                onTap: _onBackspace,
                                borderRadius: BorderRadius.circular(40),
                                child: Container(
                                  width: 68,
                                  height: 68,
                                  alignment: Alignment.center,
                                  child: const Icon(Icons.backspace_outlined, color: Colors.white, size: 22),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),

                      const SizedBox(height: 24),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
