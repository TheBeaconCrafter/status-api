# Status API

**Warning**: This is an early beta version. Do not expect a fully working product.

## Overview
The Status API is a simple service that provides status updates for various components of a system. It is designed to be lightweight and easy to integrate with other services.

## Features
- Retrieve the status of different components
- Lightweight and fast
- Easy to integrate

## Installation
To install the Status API, clone the repository and install the dependencies:

```bash
git clone https://github.com/TheBeaconCrafter/status-api.git
cd status-api
npm install
```

## Usage
To start the Status API server, run:

```bash
node index.js
```

The server will start on `http://localhost:3593`.

## Endpoints
- `GET /domain/:id`
- `GET /webresponse/:id`
- `GET /keyword/:id`
- `GET /port/:id`
- `GET /hosts`

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.