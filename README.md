# TrendWave

This project is a single-page web application built with Angular that allows users to receive real-time market data and view historical price charts for different market assets.

## Table of Contents
- [Business Requirements](#business-requirements)
- [Technical Requirements](#technical-requirements)
- [Development](#development)
- [Handling CORS Issues](#handling-cors-issues)

## Business Requirements

The web application should have the following features:

- Display real-time market price and time for a specified asset.
- Update the price dynamically whenever there's a new data update from the Web-Socket API.
- Show a historical prices chart (graph) to track market asset behavior over time.

## Technical Requirements

- **Framework**: Angular framework should be used for building the application.
- **Data Provider**:
  - Real-time data should be fetched using the Web-Socket API provided by Fintacharts platform.
  - Historical prices should be fetched using the REST API provided by Fintacharts platform.

## Development

### Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code Scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Handling CORS Issues

To handle CORS (Cross-Origin Resource Sharing) issues during development, you can consider the following approaches:

1. **Browser Workaround**:
  - For development and testing purposes to avoid security restrictions, browsers can be started with security features disabled. Example command for Chrome on Windows:
    ```bash
    chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
    ```
    **Note**: This approach should only be used for local testing and development, as it disables important security features.

2. **CORS Browser Extension**:
  - Use browser extensions that temporarily disable CORS restrictions for testing purposes. These extensions can help in development but should not be used in production environments.
