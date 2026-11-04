import 'package:flutter_test/flutter_test.dart';
import 'package:sherry_bank_app/main.dart';

void main() {
  testWidgets('Sherry Bank app smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const SherryBankApp());

    // Allow initial frames and splash timers to complete
    await tester.pump();
    expect(find.text('SHERRY BANK'), findsOneWidget);

    // Pump past the splash delay
    await tester.pump(const Duration(seconds: 2));
    await tester.pumpAndSettle();
  });
}
