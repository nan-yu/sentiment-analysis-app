# sentiment_analysis_app

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.

## Development workflow

1. Create the project

```bash
flutter create sentiment_analysis_app
cd sentiment_analysis_app
```

2. Add dependencies

Modify the `pubspec.yaml` file to add more dependencies.
- `http`: For making API requests (if you use a backend service).
- `flutter_spinkit`: (Optional) For displaying a loading indicator while fetching results.
- `provider` or other state management solutions: to manage the app's state.

```bash
flutter pub get
```

3. Implement the UI

Implement `main.dart` and `app_state.dart`.