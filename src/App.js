/* App.js */

import React, { Component } from 'react';
import xhr from 'xhr';
import Plot from './Plot.js';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
      location: '',
      data: {},
      dates: [],
      temps: [],
      selected: {
        date: '',
        temp: null
      }
  };

  fetchData = (evt) => {
    evt.preventDefault();
    console.log('fetch data for', this.state.location);
    let location = encodeURIComponent(this.state.location);
    let urlPrefix = 'http://api.openweathermap.org/data/2.5/forecast?q=';
    let urlSuffix = '&APPID=515ce83375edf147d578924ba19ae363&units=imperial';
    let url = urlPrefix + location + urlSuffix;

    let self = this;

    xhr({
          url: url
        }, function (err, data) {
          var body = JSON.parse(data.body);
          var list = body.list;
          var dates = [];
          var temps = [];
          for (var i = 0; i < list.length; i++) {
            dates.push(list[i].dt_txt);
            temps.push(list[i].main.temp);
          }

          self.setState({
            data: body,
            dates: dates,
            temps: temps
          });
        });
  };

  changeLocation = (evt) => {
    this.setState({
        location: evt.target.value
    });
  };

  onPlotClick = (data) => {
    console.log(data);
    if (data.points) {
      this.setState({
        selected: {
          date: data.points[0].x,
          temp: data.points[0].y
        }
      });
    }
  };

  render() {
    let currentTemp = 'not loaded yet';
    if (this.state.data.list) {
        currentTemp = this.state.data.list[0].main.temp;
    }
    return ( 
      <div>
        <h1>Weather</h1>
        <form onSubmit={this.fetchData}>
          <label>I want to know the weather for
            <input
              placeholder={"City, Country"}
              type="text"
              value={this.state.location}
              onChange={this.changeLocation}
            />
          </label>
        </form>
        {/*
          Render the current temperature and the forecast 
          if we have data otherwise return null
        */}
        {(this.state.data.list) ? (
          <div className="wrapper">
            {/* Render the current temperature if no specific date is selected */}
            <p className="temp-wrapper">
              <span className="temp">
                { this.state.selected.temp ? this.state.selected.temp : currentTemp }
              </span>
              <span className="temp-symbol">°F</span>
              <span className="temp-date">
                this.state.selected.temp ? this.state.selected.date : ''}
              </span>
            </p>
            <h2>Forecast</h2>
            <Plot
              xData={this.state.dates}
              yData={this.state.temps}
              type="scatter"
              onPlotClick={this.onPlotClick}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default App;
