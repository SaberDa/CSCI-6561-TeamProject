import React from 'react'
import GitHubIcon from '@material-ui/icons/GitHub';
import EmailIcon from '@material-ui/icons/Email';


const Busuanzi = () => {
  const isHome = window.location.href.endsWith('#/')
  if (isHome) {
    return (
      <div className="busuanzi">
        <span id="busuanzi_container_site_pv"> Total visit 1024 time </span>
      </div>
    )
  } else {
    return (
      <></>
    )
  }
}


export default class Footer extends React.Component<object, object> {
  render() {
    return (
      <div className="footer">
        <div className="container">
          <a href="https://github.com/SaberDa/CSCI-6561-TeamProject">
            <GitHubIcon/>
          </a>
          <a href="gli97@gwmail.gwu.edu">
            <EmailIcon id="email-icon"/>
          </a>

          <Busuanzi/>
        </div>
      </div>
    )
  }
}
