import 'dart:convert';
import 'dart:math';

import 'package:http/http.dart' as http;
var userid;
class ApiClient {
  static final ApiClient _instance = ApiClient._internal();

  ApiClient._internal();

  factory ApiClient() {
    return _instance;
  }

  static final String apiUrl = "http://10.0.2.2:9090";

  static final headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  };

  Future<Map<String, dynamic>> signUp(Map<String, dynamic> signUpBody) async {
    final request = await http.post(
      Uri.parse("$apiUrl/user/register"),
      body: jsonEncode(signUpBody),
      headers: headers,
      encoding: const Utf8Codec(),
    );

    return jsonDecode(request.body);
  }

  Future<Map<String, dynamic>> signIn(Map<String, String> loginBody) async {
    final request = await http.post(
      Uri.parse("$apiUrl/user/login"),
      headers: headers,
      body: jsonEncode(loginBody),
      encoding: const Utf8Codec(),
    );
    if (request.statusCode == 200) {
      // log("${jsonDecode(request.body)}");
      userid=jsonDecode(request.body)["user"]["accountid"].toString();
      return jsonDecode(request.body);
    }
    else
    {

      return jsonDecode(request.body);
    }
    //return jsonDecode(request.body);

  }

  Future<Map<String, dynamic>> addPromo(String code, double discount, DateTime expirationDate, String userId) async {
    final response = await http.post(
      Uri.parse('$apiUrl/addPromo'),
      body: jsonEncode({
        'code': code,
        'discount': discount,
        'expirationDate': expirationDate.toIso8601String(),
        'idUser': userId,
      }),
      headers: {'Content-Type': 'application/json'},
    );

    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> checkPromo(String code, String userId) async {
    final response = await http.post(
      Uri.parse('$apiUrl/checkPromo'),
      body: jsonEncode({
        'code': code,
        'idUser': userId,
      }),
      headers: {'Content-Type': 'application/json'},
    );

    return jsonDecode(response.body);
  }

  Future<List<Map<String, dynamic>>> getBestSellingPromos(String userId) async {
    final response = await http.post(
      Uri.parse('$apiUrl/getBestSellingPromos'),
      body: jsonEncode({'user': userId}),
      headers: {'Content-Type': 'application/json'},
    );

    return List<Map<String, dynamic>>.from(jsonDecode(response.body));
  }
}