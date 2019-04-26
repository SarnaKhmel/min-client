// Takes timer component's state.currentTime and translates it into the proper format for the timer screen
const calculateAndRenderTimer = (currentTime, intervalNumber) => {
    
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime - (minutes * 60);

    if (currentTime === 0) {
      return "00:00:00";
    }
    else if (currentTime < 10 ) {
      return "00:00:0" + currentTime;
    }
    else if (currentTime < 60 ) {
      return "00:00:" + currentTime;
    }
    else if (currentTime < 600) {

      if (seconds < 60 && seconds >= 10) {
        return "00:0" + minutes + ":" + seconds;
      }
      else if (seconds < 10) {
        return "00:0" + minutes + ":0" + seconds;
      }  
    }
    else if (currentTime < 3600) {
      if (seconds < 60 && seconds >= 10) {
        return "00:" + minutes + ":" + seconds;
      }
      else if (seconds < 10) {
        return "00:" + minutes + ":0" + seconds;
      }  
    }
    else if ( currentTime < 86400) {
      const hours = Math.floor(currentTime / 3600);
      const hourMinutes = Math.floor((currentTime - (hours * 3600)) / 60);
      const hourSeconds = currentTime - (hours * 3600) - (hourMinutes * 60);

      if ( hours < 10 && hourMinutes < 10 && hourSeconds < 10) {
        return "0" + hours + ":0" + hourMinutes + ":0" + hourSeconds;
      }
      else if (hours < 10 && hourMinutes < 10) {
        return "0" + hours + ":0" + hourMinutes + ":" + hourSeconds;
      }
      else if (hours < 10 && hourSeconds < 10) {
        return "0" + hours + ":" + hourMinutes + ":0" + hourSeconds;
      }
      else if (hours < 10) {
        return "0" + hours + ":" + hourMinutes + ":" + hourSeconds;
      }
      else if (hourMinutes < 10 && hourSeconds < 10) {
        return hours + ":0" + hourMinutes + ":0" + hourSeconds;
      }
      else if (hours < 10 && hourSeconds < 10) {
        return "0" + hours + ":" + hourMinutes + ":0" + hourSeconds;
      }
      else if (hourMinutes < 10) {
        return hours + ":0" + hourMinutes + ":" + hourSeconds;
      }
      else if (hourSeconds < 10) {
        return hours + ":" + hourMinutes + ":0" + hourSeconds;
      }
      else {
        return hours + ":" + hourMinutes + ":" + hourSeconds;
      }

    }
    else { 
      clearInterval(intervalNumber);
      return "24:00:00"
    }
  };

  export default calculateAndRenderTimer;