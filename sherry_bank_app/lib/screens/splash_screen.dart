import 'package:flutter/material.dart';
import '../core/constants/app_assets.dart';
import '../core/constants/app_colors.dart';
import '../services/api_service.dart';
import 'auth/mpin_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;

  String _statusText = 'Initializing secure banking session...';
  bool _isConnected = false;

  @override
  void initState() {
    super.initState();

    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    );

    _fadeAnimation = CurvedAnimation(
      parent: _animController,
      curve: Curves.easeIn,
    );

    _scaleAnimation = Tween<double>(begin: 0.85, end: 1.0).animate(
      CurvedAnimation(
        parent: _animController,
        curve: Curves.easeOutBack,
      ),
    );

    _animController.forward();
    _initializeApp();
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  Future<void> _initializeApp() async {
    // 1. Handshake with Sherry Bank Node.js Gateway
    final health = await ApiService().checkHealth();

    if (mounted) {
      setState(() {
        _isConnected = health['status'] == 'ONLINE';
        _statusText = _isConnected
            ? 'Connected to Core Gateway (Staging Active)'
            : 'Starting offline secure mode...';
      });

      // Allow user to view the branding
      await Future.delayed(const Duration(milliseconds: 1800));

      // if (mounted) {
      //   Navigator.pushReplacement(
      //     context,
      //     PageRouteBuilder(
      //       pageBuilder: (_, __, ___) => const MpinScreen(),
      //       transitionsBuilder: (_, animation, __, child) {
      //         return FadeTransition(opacity: animation, child: child);
      //       },
      //       transitionDuration: const Duration(milliseconds: 600),
      //     ),
      //   );
      // }
    }
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // 1. Full-screen Brand Splash Background
          Image.asset(
            AppAssets.splashBg,
            fit: BoxFit.cover,
            width: size.width,
            height: size.height,
            
          ),

          
          

          // 3. Animated Brand Logo & Typography
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [

                
                       
                     
                           Image.asset(
                            AppAssets.logo,
                            width: 350,
                         
                            fit: BoxFit.contain,
                            
                          ),
                      
                  // 4. Bottom Gateway Connection Status
                  FadeTransition(
                    opacity: _fadeAnimation,
                    child: Column(
                      children: [
                        SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.2,
                            color: _isConnected ? AppColors.primary : AppColors.accentGold,
                          ),
                        ),
                        const SizedBox(height: 14),
                        Text(
                          _statusText,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 12,
                            color: _isConnected ? AppColors.primaryLight : AppColors.textMuted,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'SBP Licensed EMI Framework',
                          style: TextStyle(
                            fontSize: 10,
                            color: AppColors.textMuted.withValues(alpha: 0.7),
                            letterSpacing: 1,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
