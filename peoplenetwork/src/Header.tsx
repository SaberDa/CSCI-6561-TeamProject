import React from 'react'


type HeaderProps = {
    title: string;
  }
  
  export default class Header extends React.Component<HeaderProps, object> {
    render() {
      return (
        <header>
          <div className="page_title">
            <div className="container">
              <div className="topbar">
                <div className="links">
                  <a href="#/contribute">
                    Contribute
                  </a>
                  <a href="#/about">
                    About
                  </a>
                  <a href="https://github.com/SaberDa/CSCI-6561-TeamProject">
                    Github
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="container title">
            <p className="sub">
              <a href="/">
                People Network
              </a>
            </p>
            <h1>
              {this.props.title}
            </h1>
          </div>
        </header>
      )
    }
  }
  