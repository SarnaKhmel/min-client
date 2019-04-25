# min
> React & Redux front end to min, a multi-use web based timer application. 

Min has two modes, multi-timer and pomodoro. In multitimer mode, users can run multiple timers simultaneously (useful while timing multiple items while cooking, for example). In pomodoro mode, users can time periods of focus and rest that will enhance their ability to learn and master skills quickly via the [Pomodoro Technique](https://en.wikipedia.org/wiki/Pomodoro_Technique).

Repo for backend API built with Node, Express and MongoDB available here: https://github.com/slowbeam/min-server

##

![min demo](https://github.com/slowbeam/mins-client/blob/master/public/demo/min_demo_3.gif)

## Installation

OS X & Linux:

```sh
npm install
```

## Usage example

Multi-timer mode allows for many timers running at once:

![min multi-timer demo](https://github.com/slowbeam/mins-client/blob/master/public/demo/min_demo_1.gif)

Pomodoro mode allows users to select a length for period of focus, break and long break and time a period of study/work:

![min pomodoro demo](https://github.com/slowbeam/mins-client/blob/master/public/demo/min_demo_2.gif)


## Development setup

If you would like to run the frontend and backend together in development mode, please follow the following steps:

1. Clone the backend repo [here](https://github.com/slowbeam/min-server).
2. Follow the backend readme's instructions to start up the API on a local server.
3. Create a .env file in your cloned frontend repo and point the environment variable REACT_APP_API_URL to your localhost API address. 
4. Be sure to also assign the environment variable REACT_APP_STORAGE_KEY to a random string of your choice.
5. Start the frontend local development server:

OS X & Linux:

```sh
npm start
```

## Release History

* 0.1.0
    * First official release
   


## Meta

Sandy Edwards – [@sedwardscode](https://twitter.com/sedwardscode) – sedwardscode@gmail.com

[https://github.com/slowbeam](https://github.com/slowbeam)

## Contributing

1. Fork it (<https://github.com/slowbeam/mins-client/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
