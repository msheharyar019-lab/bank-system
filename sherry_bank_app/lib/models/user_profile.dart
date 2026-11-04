class UserProfile {
  final String userId;
  final String accountNumber;
  final String holderName;
  final String phoneNumber;
  final double balance;
  final String currency;
  final String tier;

  UserProfile({
    required this.userId,
    required this.accountNumber,
    required this.holderName,
    required this.phoneNumber,
    required this.balance,
    required this.currency,
    required this.tier,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      userId: json['userId'] ?? '',
      accountNumber: json['accountNumber'] ?? '',
      holderName: json['holderName'] ?? 'Customer',
      phoneNumber: json['phoneNumber'] ?? '',
      balance: (json['balance'] as num?)?.toDouble() ?? 0.0,
      currency: json['currency'] ?? 'PKR',
      tier: json['tier'] ?? 'Standard',
    );
  }

  Map<String, dynamic> toJson() => {
        'userId': userId,
        'accountNumber': accountNumber,
        'holderName': holderName,
        'phoneNumber': phoneNumber,
        'balance': balance,
        'currency': currency,
        'tier': tier,
      };
}
