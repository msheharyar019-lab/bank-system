class TransactionItem {
  final String id;
  final String userId;
  final String type; // 'CREDIT' or 'DEBIT'
  final String title;
  final String source;
  final double amount;
  final String status;
  final DateTime timestamp;
  final String reference;
  final String? note;

  TransactionItem({
    required this.id,
    required this.userId,
    required this.type,
    required this.title,
    required this.source,
    required this.amount,
    required this.status,
    required this.timestamp,
    required this.reference,
    this.note,
  });

  bool get isCredit => type.toUpperCase() == 'CREDIT';

  factory TransactionItem.fromJson(Map<String, dynamic> json) {
    return TransactionItem(
      id: json['id'] ?? '',
      userId: json['userId'] ?? '',
      type: json['type'] ?? 'DEBIT',
      title: json['title'] ?? 'Transaction',
      source: json['source'] ?? 'General',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      status: json['status'] ?? 'COMPLETED',
      timestamp: DateTime.tryParse(json['timestamp'] ?? '') ?? DateTime.now(),
      reference: json['reference'] ?? '',
      note: json['note'],
    );
  }
}
