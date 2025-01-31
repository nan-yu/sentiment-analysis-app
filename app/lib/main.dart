import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sentiment_analysis_app/app_state.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => AppState(),
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sentiment Analysis App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: SentimentAnalysisScreen(),
    );
  }
}

class SentimentAnalysisScreen extends StatelessWidget {
  final TextEditingController _topicController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Sentiment Analysis'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: _topicController,
              decoration: InputDecoration(
                labelText: 'Enter a topic',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                Provider.of<AppState>(context, listen: false)
                    .analyzeSentiment(_topicController.text);
              },
              child: Text('Analyze'),
            ),
            SizedBox(height: 16),
            Expanded(
              child: Consumer<AppState>(
                builder: (context, appState, child) {
                  if (appState.isLoading) {
                    return Center(child: CircularProgressIndicator());
                  } else {
                    return DefaultTabController(
                      length: 2, // Number of tabs
                      child: Scaffold(
                        appBar: AppBar(
                          title: Text('Sentiment Analyze Result'),
                          bottom: TabBar(
                            tabs: [
                              Tab(
                                icon: Icon(Icons.thumb_up),
                                text: "Positive",
                              ),
                              Tab(
                                icon: Icon(Icons.thumb_down),
                                text: "Negative",
                              ),
                            ],
                          ),
                        ),
                        body: TabBarView(
                          children: [
                            _buildScrollableList(appState.positiveAspects),
                            _buildScrollableList(appState.negativeAspects),
                          ],
                        ),
                      ),
                    );
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildScrollableList(List<String> aspects) {
    if (aspects.isEmpty) {
      return Center(child: Text("No aspects found."));
    }

    return ListView.separated(
      itemCount: aspects.length,
      separatorBuilder: (context, index) =>
          Divider(height: 1, color: Colors.grey),
      itemBuilder: (context, index) {
        return Card(
          margin: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          elevation: 2,
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Icon(Icons.comment, color: Colors.blueGrey), // Add an icon
                SizedBox(width: 12),
                Expanded(
                  // Use Expanded to prevent overflow
                  child: Text(
                    aspects[index],
                    style: TextStyle(fontSize: 16),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
