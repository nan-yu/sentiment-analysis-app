import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class AppState with ChangeNotifier {
  bool _isLoading = false;
  List<String> _positiveAspects = [];
  List<String> _negativeAspects = [];

  bool get isLoading => _isLoading;
  List<String> get positiveAspects => _positiveAspects;
  List<String> get negativeAspects => _negativeAspects;

  Future<void> analyzeSentiment(String topic) async {
    _isLoading = true;
    _positiveAspects = [];
    _negativeAspects = [];
    notifyListeners();

    // Replace with your actual API endpoint
    final url = Uri.parse(
        'https://sentiment-analysis-686538628455.us-central1.run.app/analyzeFlow');
    // final url = Uri.parse('http://localhost:3400/analyzeFlow');
    final body = '{"data": {"topic": "$topic"}}';

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: body,
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _positiveAspects = List<String>.from(data['result']['positive']);
        _negativeAspects = List<String>.from(data['result']['negative']);
      } else {
        // Handle error responses
        print('Error: ${response.statusCode}');
      }
    } catch (e) {
      // Handle network or other errors
      print('Error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
