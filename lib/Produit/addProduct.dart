
import 'dart:io';

import 'package:ecomproduit/Produit/detailPage.dart';
import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:form_builder_image_picker/form_builder_image_picker.dart';
import '../core/api_client.dart';
import '/Produit/product-page.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
class AddProduct extends StatefulWidget {
  const AddProduct();

  @override
  State<AddProduct> createState() => AddProductState();
}

class AddProductState extends State<AddProduct> {

  PickedFile?  _image;
  String? _name;
  String? _category;
  String? _description;
  double? _price;
  int? _quantity =1 ;
  bool _AR = false;
  final String _baseUrl = "10.0.2.2:9090";
  String selectedQuantity = '1';
  final ImagePicker _picker = ImagePicker();
  File? image;
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  Future<bool> sellerEditImage(
      Map<String, String> body, PickedFile? filepath) async {
    String apiUrl =
        "http://10.0.2.2:9090/produit/addProduct";

    if (filepath == null) {
      var request = http.MultipartRequest('POST', Uri.parse(apiUrl))
        ..fields.addAll(body);
      var response = await request.send();
      if (response.statusCode == 200) {
        return true;
      } else {
        return false;
      }
    } else {
      var request = http.MultipartRequest('POST', Uri.parse(apiUrl))
        ..fields.addAll(body)
        ..files
            .add(await http.MultipartFile.fromPath('Image', filepath.path));
      var response = await request.send();

      if (response.statusCode == 201) {
        return true;
      } else {
        return false;
      }
    }
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white, // Background color
      appBar: AppBar(
        title: const Text("Add Product"),
        backgroundColor: Colors.orangeAccent, // App bar color
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              ElevatedButton(
                onPressed: () async {
                  final image = await ImagePicker().pickImage(source: ImageSource.gallery  );
                  if (image == null) return;
                  final imageTemp = File(image.path);
                  _image = PickedFile(image.path);
                  setState(() => this.image = imageTemp);
                  print(_image?.path);
                  print(imageTemp);
                  print(image);
//print(‘Image picked’);

                },
                child: Text("Pick an Image"),
              ),


              const SizedBox(height: 16),
              TextFormField(
                decoration: InputDecoration(
                  labelText: "Product Name",
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.text_fields), // Text icon
                ),
                onSaved: (String? value) {
                  _name = value;
                },
                validator: (String? value) {
                  if (value!.isEmpty || value.length < 5) {
                    return "Le nom de Produit doit contenir au moins 5 caractères";
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                decoration: InputDecoration(
                  labelText: "Description",
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.description), // Description icon
                ),
                onSaved: (String? value) {
                  _description = value;
                },
                validator: (String? value) {
                  if (value!.isEmpty) {
                    return "Veuillez saisir une Description";
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                decoration: InputDecoration(
                  labelText: "Categorie",
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.category), // Description icon
                ),
                onSaved: (String? value) {
                  _category = value;
                },
                validator: (String? value) {
                  if (value!.isEmpty) {
                    return "Veuillez saisir une Description";
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: "Price",
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.monetization_on), // Price icon
                ),
                onSaved: (String? value) {
                  _price = double.tryParse(value!);
                },
                validator: (String? value) {
                  if (value!.isEmpty || double.tryParse(value) == null) {
                    return "Veuillez saisir un prix valide";
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              Column(
                children: <Widget>[
                  Text(
                    'Select Quantity',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  CupertinoPicker(
                    itemExtent: 32,
                    onSelectedItemChanged: (int index) {
                      setState(() {
                        selectedQuantity = (index + 1).toString();
                        _quantity = int.tryParse(selectedQuantity);

                      });
                    },
                    children: List<Widget>.generate(50, (int index) {
                      return Center(
                        child: Text((index + 1).toString()),
                      );
                    }),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      primary: Colors.orangeAccent, // Button background color
                    ),
                    child: const Text("Creer une Certification"),
                    onPressed: () async {
                      if (_formKey.currentState!.validate()) {
                        _formKey.currentState!.save();
                        print(_image);
/*
    final Uri url = Uri.http(_baseUrl, "/produit/addProduct");

    // Create a multipart request
    var request = http.MultipartRequest('POST', url);

    // Add text fields to the request
    request.fields['name'] = _name.toString();
    request.fields['description'] = _description.toString();
    request.fields['price'] = _price.toString().toString();
    request.fields['category'] = _category.toString();
    request.fields['Seller'] = '0';
    request.fields['rating'] = '0';
    request.fields['quantity'] = _quantity.toString();
    request.fields['AR'] = _AR.toString();
    // Add the image file to the request
    request.files.add(
    await http.MultipartFile.fromPath('image', _image!.path,filename:_image!.path)
    );

    try {
    // Send the request
    final response = await request.send();

    if (response.statusCode == 200) {
    print('Success');
    } else {
    print('Failed: ${response.statusCode}');
    }
    } catch (e) {
    print('Error: $e');
    }
*/
                        /*
                        var request = http.MultipartRequest("POST", Uri.http(_baseUrl, "/produit/addProduct"));

// Set text fields using request.fields
                        request.fields["name"] = _name!;
                        request.fields["description"] = _description!;
                        request.fields["price"] = _price.toString();
                        request.fields["category"] = "sport";
                        request.fields["Seller"] = "2";
                        request.fields["AR"] = _AR.toString();
                        request.fields["quantity"] = "0";
                        request.fields["rating"] = "0";
                       print(request);
// Add the image file using request.files
                        request.files.add(http.MultipartFile.fromBytes("image", File(_image!.path).readAsBytesSync(), ));



                        try {
                          var response = await request.send();
                          if (response.statusCode == 200) {
                            print('Image uploaded successfully');
                          } else {
                            print('Image upload failed with status code: ${response.statusCode}');
                          }
                        } catch (error) {
                          print('Error uploading image: $error');
                        }
                         */

                        // String msg = "Username: ${_name}\nEmail: ${_price}\nPassword: ${_description}\nYear: ${_AR}";
                        Map<String, String> body = {
                          "name": _name.toString(),
                          "description": _description.toString(),
                          //_image!.path.split('/').last
                          "price":  _price.toString(),
                          "category" : _category.toString(),
                          "quantity":  _quantity.toString(),
                          "Seller": "$userid",
                          "ratings": "0",
                          "AR": _AR.toString(),

                        };
                        sellerEditImage(body, _image);
                        setState(() {
                          Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(
                                builder: (BuildContext context) => MoreProducts(),
                              ));
                        });
                        //http.post(Uri.http(_baseUrl, "/produit/addProduct"), body: json.encode(formData), headers: headers)
                        //  .then((http.Response response) async {
                        //  print(response.statusCode);
                        /*   Dio dio = new Dio();
                          final response = await Dio().post(
                            "http://"+_baseUrl+ "/produit/addProduct",
                            data: formData,
                              options: Options(contentType: 'multipart/form-data')
                                  );
                        if(response.statusCode == 200) {
   // Map<String, dynamic> userData = json.decode(response.body);
                          print("sucesssss");
    }
                        ;
*/

                        // SharedPreferences
                        /*
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                            builder: (BuildContext context) => DetailPage(
                              product: Product(
                                _image ?? "assets/images/1.jpg",
                                _name!  ,
                                _description! ,
                                _price! ,
                                0,
                                0,
                                0,
                                "",
                                _AR,
                              ),

                            ),
                          ),
                        );
                      */


                      }
                    },


                  ),


                  const SizedBox(width: 20),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      primary: Colors.grey, // Button background color
                    ),
                    child: const Text("Annuler"),
                    onPressed: () {


                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (BuildContext context) => MoreProducts(),
                        ),
                      );
                    },
                  ),


                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
