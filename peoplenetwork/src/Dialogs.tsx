import React, {useState} from 'react'
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import Checkbox from '@material-ui/core/Checkbox';
import TuneIcon from '@material-ui/icons/Tune';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';


import { SourceItem, ItemInfo } from '../server/datatypes'
import { mergeInfo } from '../server/utils'

type EditOptionsDialogProps = {
  setOpt: (opt: any) => void,
  getOpt: () => any,
}
type EditOptionsDialogState = {
  open: boolean,
  content: string,
}

class EditOptionsDialog extends React.Component<EditOptionsDialogProps, EditOptionsDialogState> {
  constructor(props: EditOptionsDialogProps) {
    super(props)
    this.state = {
      open: false,
      content: ""
    }
  }

  handleClickOpen() {
    this.setState({open: true})
    this.setTextArea()
  };

  handleClose() {
    this.setState({open: false})
  };

  setTextArea() {
    let opt = this.props.getOpt()
    let content = JSON.stringify(opt, null, 2)
    this.setState({content: content})
  }

  textChanged(event: any) {
    this.setState({
      content: event.target.value 
    })
  }

  handleClickConfirm() {
    let options;
    try {
      options = JSON.parse(this.state.content)
      this.props.setOpt(options)
      this.setState({open: false})
    } catch(err) {
      console.log(err)
      let ta = document.getElementById("edit-options-content")
      if (ta !== null) {
          ta.style.border = "2px solid #ff3333"
      }
      let tip = document.getElementById("edit-options-tips")
      console.log(tip)
      if (tip !== null) {
          tip.innerHTML = "JSON parsing failed, please check your input"
          tip.style.color = "#ff3333"
          tip.style.fontSize = "10px"
      }
    }
  }

  render() {
    return (
      <div className="EditOptionsDialog">
        <Tooltip title="Edit network config" placement="top">
          <EditIcon onClick={() => {this.handleClickOpen()}}/>
        </Tooltip>
        <Dialog open={this.state.open} onClose={() => {this.handleClose()}} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Edit network view configuration</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Configure the network view directly through JSON. For details of configurable items, please refer to
              <a href="https://visjs.github.io/vis-network/docs/network/">vis-network documents</a>.
            </DialogContentText>
            <p id="edit-options-tips"> </p>
            <textarea id="edit-options-content"
              rows={18} cols={72}
              value={this.state.content}
              onChange={(e) => {this.textChanged(e)}}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {this.handleClose()}} color="primary">
              Cancel
            </Button>
            <Button onClick={() => {this.handleClickConfirm()}} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}