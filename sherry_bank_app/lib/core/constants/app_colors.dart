import 'package:flutter/material.dart';

class AppColors {
  // Primary brand palette (Fintech Luxury: Obsidian, Emerald, & Gold)
  static const Color background = Color(0xFF090D16);
  static const Color surface = Color(0xFF131B2E);
  static const Color surfaceLight = Color(0xFF1E293B);
  
  static const Color primary = Color(0xFF10B981);       // Emerald Green (Success, Growth)
  static const Color primaryLight = Color(0xFF34D399);
  static const Color primaryDark = Color(0xFF059669);
  
  static const Color accentGold = Color(0xFFF59E0B);     // Platinum / Gold accent
  static const Color accentCyan = Color(0xFF06B6D4);     // Tech highlight
  static const Color danger = Color(0xFFEF4444);         // Debit / Error
  
  // Text Colors
  static const Color textPrimary = Color(0xFFF8FAFC);
  static const Color textSecondary = Color(0xFF94A3B8);
  static const Color textMuted = Color(0xFF64748B);

  // Gradient presets
  static const LinearGradient cardGradient = LinearGradient(
    colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient goldGradient = LinearGradient(
    colors: [Color(0xFFF59E0B), Color(0xFFD97706)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient emeraldGradient = LinearGradient(
    colors: [Color(0xFF10B981), Color(0xFF059669)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
