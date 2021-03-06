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


import { mergeInfo } from './utils'
import { SourceItem, ItemInfo } from './datatypes'


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
        tip.innerHTML = "JSON parsing failed, please check."
        tip.style.color = "#ff3333"
        tip.style.fontSize = "10px"
      }
    }
  }

  render() {
    return (
      <div className="EditOptionsDialog">
        <Tooltip title="Edit" placement="top">
          <EditIcon onClick={() => {this.handleClickOpen()}}/>
        </Tooltip>
        <Dialog open={this.state.open} onClose={() => {this.handleClose()}} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Edit</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Configure the network view directly through JSON. For details of configurable items, please refer to
              <a href="https://visjs.github.io/vis-network/docs/network/">vis-network doc</a> 。
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


type SearchDialogProps = {
  queryAndFocus: (q: string) => void,
}
type SearchDialogState = {
  open: boolean,
  queryText: string,
}

class SearchDialog extends React.Component<SearchDialogProps, SearchDialogState> {
  constructor(props: SearchDialogProps) {
    super(props)
    this.state = {
      open: false,
      queryText: "",
    }
  }

  handleClickOpen() {
    this.setState({open: true})
  };

  handleClose() {
    this.setState({open: false})
  };

  handleClickSearch() {
    const q = this.state.queryText
    this.props.queryAndFocus(q)
    this.setState({open: false, queryText: ""})
  }

  textChanged(event: any) {
    this.setState({
      queryText: event.target.value
    })
  }

  handlePressEnter(event: any) {
    if (event.key === "Enter") {
      this.handleClickSearch()
    }
  }

  render() {
    return (
      <>
        <Tooltip title="Search" placement="top">
          <SearchIcon onClick={() => this.handleClickOpen()}/>
        </Tooltip>
        <Dialog open={this.state.open} onClose={() => {this.handleClose()}} aria-labelledby="form-dialog-title">
          <DialogContent id="searchDialog">
            <InputBase
              value={this.state.queryText}
              onChange={(e) => this.textChanged(e)}
              onKeyPress={(e) => this.handlePressEnter(e)}
              placeholder="Enter node label"
            />
            <IconButton type="submit" onClick={() => this.handleClickSearch()} >
              <SearchIcon/>
            </IconButton>
          </DialogContent>
        </Dialog>
      </>
    )
  }
}


type FilterDialogProps = {
  queryAndFilter: (q: string, reverse: boolean) => void,
  reset: () => void,
}
type FilterDialogState = {
  open: boolean,
  queryText: string,
  reverse: boolean,
}

class FilterDialog extends React.Component<FilterDialogProps, FilterDialogState> {
  constructor(props: FilterDialogProps) {
    super(props)
    this.state = {
      open: false,
      queryText: "",
      reverse: true,
    }
  }

  handleClickOpen() {
    this.setState({open: true})
  };

  handleClose() {
    this.setState({open: false})
  };

  handleClickFilter() {
    const q = this.state.queryText
    this.props.queryAndFilter(q, this.state.reverse)
    this.setState({open: false, queryText: ""})
  }

  handleClickReset() {
      this.props.reset()
      this.setState({open: false, queryText: ""})
  }

  textChanged(event: any) {
    this.setState({
      queryText: event.target.value
    })
  }

  handlePressEnter(event: any) {
    if (event.key === "Enter") {
      this.handleClickFilter()
    }
  }

  handleChangeReverse(event: any) {
    this.setState({
      reverse: event.target.checked
    })
  }

  render() {
    return (
      <>
        <Tooltip title="Filter" placement="top">
          <FilterListIcon onClick={() => this.handleClickOpen()}/>
        </Tooltip>
        <Dialog open={this.state.open} onClose={() => {this.handleClose()}} aria-labelledby="form-dialog-title">
          <DialogContent id="filterDialog">
            <InputBase
              value={this.state.queryText}
              onChange={(e) => this.textChanged(e)}
              onKeyPress={(e) => this.handlePressEnter(e)}
              placeholder="(ex：categorie:person)"
            />
            <IconButton type="submit" onClick={() => this.handleClickFilter()} >
              <Tooltip title="filter" placement="top">
                <FilterListIcon/>
              </Tooltip>
            </IconButton>
            <IconButton type="submit" onClick={() => this.handleClickReset()} >
              <Tooltip title="reset" placement="top">
                <AutorenewIcon/>
              </Tooltip>
            </IconButton>
            <Tooltip title="reverse" placement="top">
              <Checkbox checked={this.state.reverse} onChange={(e) => this.handleChangeReverse(e)}/>
            </Tooltip>
          </DialogContent>
        </Dialog>
      </>
    )
  }
}


const defaultOpt = (oldOpt: any) => {
  const opt = Object.assign({}, oldOpt)
  if (!("physics" in opt)) { opt.physics = {} }
  opt.physics.solver = "forceAtlas2Based"
  let atlas;
  if (!("forceAtlas2Based" in opt.physics)) {
    atlas = {}
    opt.physics.forceAtlas2Based = atlas
  } else {
    atlas = opt.physics.forceAtlas2Based
  }
  const defaults = {
    gravitationalConstant: -20,
    centralGravity: 0.002,
    springLength: 100,
    springConstant: 0.01,
  }
  for (const [k, v] of Object.entries(defaults)) {
    if (!(k in atlas)) {
      atlas[k] = v
    }
  }
  if (!("edges" in opt)) { opt.edges = {} }
  if (!("font" in opt.edges)) { opt.edges.font = {} }
  if (!("size" in opt.edges.font)) { opt.edges.font.size = 14 }
  return opt
}


type sliderProps = {
  setOpt: (opt: any) => void,
  getOpt: () => any,
}

const GravitationalConstantSlider = (props: sliderProps) => {
  const opt = defaultOpt(props.getOpt())
  let atlas = opt.physics.forceAtlas2Based
  const [value, setValue] = useState(atlas.gravitationalConstant)

  const handleChange = (event: any, newValue: number | number[]) => {
    atlas.gravitationalConstant = newValue
    setValue(newValue)
    props.setOpt(opt)
  }

  return (
    <>
      <Typography gutterBottom>
        Gravitational constant
      </Typography>
      <Slider
        value={value}
        onChange={handleChange}
        min={-100}
        max={0}
        valueLabelDisplay="auto"
        aria-labelledby="continuous-slider"
      />
    </>
  )
}

const SpringConstantSlider = (props: sliderProps) => {
  const opt = defaultOpt(props.getOpt())
  let atlas = opt.physics.forceAtlas2Based
  const [value, setValue] = useState(Math.log10(atlas.springConstant))

  const handleChange = (event: any, newValue: number | number[]) => {
    const newVal = 10**(newValue as number)
    atlas.springConstant = newVal
    setValue(newValue as number)
    props.setOpt(opt)
  }

  const labelFormat = (value: number) => {
    return "1e^" + value
  }

  return (
    <>
      <Typography gutterBottom>
        Spring constant
      </Typography>
      <Slider
        value={value}
        onChange={handleChange}
        step={0.5}
        min={-5}
        max={0}
        valueLabelDisplay="auto"
        valueLabelFormat={labelFormat}
        aria-labelledby="non-linear-slider"
      />
    </>
  )
}

const CustomSwitch = withStyles({
  switchBase: {
    color: "#3f51b5",
    '&$checked': {
      color: "#3f51b5",
    },
    '&$checked + $track': {
      backgroundColor: "#3f51b5",
    },
  },
  checked: {},
  track: {},
})(Switch);


const PhysicsSwitch = (props: sliderProps) => {
  const opt = defaultOpt(props.getOpt())
  const [value, setValue] = useState(opt.physics.enabled)

  const handleChange = (event: any) => {
    const checked = event.target.checked
    opt.physics.enabled = checked
    setValue(checked)
    props.setOpt(opt)
  }

  return (
    <>
      <Typography gutterBottom>
        Physics Efficient
      </Typography>
      <CustomSwitch checked={value} onChange={handleChange} name="physicsCheck" />
    </>
  )

}


const HiddenEdgeLabelSwitch = (props: sliderProps) => {
  const opt = defaultOpt(props.getOpt())
  const [value, setValue] = useState(opt.edges.font.size === 0)

  const handleChange = (event: any) => {
    const checked = event.target.checked
    if (checked) {
      opt.edges.font.size = 0
    } else {
      opt.edges.font.size = 14
    }
    setValue(checked)
    props.setOpt(opt)
    console.log(opt)
  }

  return (
    <>
      <Typography gutterBottom>
        Hidden bottom button
      </Typography>
      <CustomSwitch checked={value} onChange={handleChange} name="hiddenEdgeLabelCheck" />
    </>
  )

}


type TuneDialogProps = {
  setOpt: (opt: any) => void,
  getOpt: () => any,
}
type TuneDialogState = {
  open: boolean
}

class TuneDialog extends React.Component<TuneDialogProps, TuneDialogState> {
  constructor(props: TuneDialogProps) {
    super(props)
    this.state = {
      open: false,
    }
  }

  handleClickOpen() {
    this.setState({open: true})
  };

  handleClose() {
    this.setState({open: false})
  };

  render() {
    return (
      <>
        <Tooltip title="Config" placement="top">
          <TuneIcon onClick={() => this.handleClickOpen()}/>
        </Tooltip>
        <Dialog open={this.state.open} onClose={() => {this.handleClose()}} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Config</DialogTitle>
          <DialogContent id="tuneDialog">
            <PhysicsSwitch
              setOpt={this.props.setOpt}
              getOpt={this.props.getOpt}/>
            <GravitationalConstantSlider
              setOpt={this.props.setOpt}
              getOpt={this.props.getOpt}/>
            <SpringConstantSlider
              setOpt={this.props.setOpt}
              getOpt={this.props.getOpt}/>
            <HiddenEdgeLabelSwitch
              setOpt={this.props.setOpt}
              getOpt={this.props.getOpt}/>
          </DialogContent>
        </Dialog>
      </>
    )
  }
}


const InforBoardSwitch = (props: {switchState: boolean, setSwitch: (on: boolean) => void}) => {
  const handleChange = (event: any) => {
    const checked = event.target.checked
    props.setSwitch(checked)
  }

  return (
    <FormControlLabel
      control={<CustomSwitch checked={props.switchState} onChange={handleChange} name="inforBoardCheck" />}
      label="Alert"
      labelPlacement="start"
    />
    
  )
}


const HiddenUnselectedSwitch = (props: {switchState: boolean, setSwitch: (on: boolean) => void}) => {
  const handleChange = (event: any) => {
    const checked = event.target.checked
    props.setSwitch(checked)
  }

  return (
    <FormControlLabel
      control={<CustomSwitch checked={props.switchState} onChange={handleChange} name="hiddenUnselectedCheck" />}
      label="Hidden other nodes"
      labelPlacement="start"
    />
    
  )
}


type SettingDialogProps = {
  inforBoardSwitch: boolean,
  setInforBoardSwitch: (on: boolean) => void,
  hiddenUnselectedSwitch: boolean,
  setHiddenUnselectedSwitch: (on: boolean) => void,
}
type SettingDialogState = {
  open: boolean
}

class SettingDialog extends React.Component<SettingDialogProps, SettingDialogState> {
  constructor(props: SettingDialogProps) {
    super(props)
    this.state = {
      open: false
    }
  }

  handleClickOpen() {
    this.setState({open: true})
  };

  handleClose() {
    this.setState({open: false})
  };

  render() {
    return (
      <>
        <Tooltip title="Setting" placement="top">
          <SettingsIcon onClick={() => this.handleClickOpen()}/>
        </Tooltip>
        <Dialog open={this.state.open} onClose={() => {this.handleClose()}} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Setting</DialogTitle>
          <DialogContent id="tuneDialog">
            <InforBoardSwitch
              switchState={this.props.inforBoardSwitch}
              setSwitch={this.props.setInforBoardSwitch}
            />
            <HiddenUnselectedSwitch
              switchState={this.props.hiddenUnselectedSwitch}
              setSwitch={this.props.setHiddenUnselectedSwitch}
            />
          </DialogContent>
        </Dialog>
      </>
    )
  }
}

type setInfoMth = (info: ItemInfo) => void

type ImportDialogProps = {
  setInfo: setInfoMth,
  info: ItemInfo,
}
type ImportDialogState = {
  open: boolean,
  sourceUrl: string,
  items: Array<SourceItem>,
  selected: null | SourceItem
}


class ImportDialog extends React.Component<ImportDialogProps, ImportDialogState> {

  constructor(props: ImportDialogProps) {
    super(props)
    this.state = {
      open: false,
      sourceUrl: "",
      items: [],
      selected: null,
    }
  }

  handleClickOpen() {
    this.setState({open: true})
    if (this.state.items.length === 0) {
      this.loadSource()
    }
  };

  handleClose() {
    this.setState({open: false})
  };

  sourceChanged(event: any) {
    this.setState({
      sourceUrl: event.target.value
    })
    this.loadSource()
  }

  loadSource() {
    fetch(this.state.sourceUrl)
      .then(res => res.json())
      .then(data => {
        this.setState({
          items: data.data
        })
      },
      (error) => {
        console.log(error)
        this.setState({
          items: []
        })
      })
  }

  onSelectedChange(event: any, newValue: SourceItem | null) {
    this.setState({
      selected: newValue
    })
  }

  loadItem() {
    if (this.state.selected === null) {return}
    const url = this.state.selected.data
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const newInfo = mergeInfo(this.props.info, data)
        this.props.setInfo(newInfo)
      },
      (error) => {
        console.log(error)
      })
    this.handleClose()
  }

  handleClickConfirm() {
    this.loadItem()
  }

  render() {
    return (
      <>
        <button onClick={() => this.handleClickOpen()}>Import basic data</button>
        {/* <button onClick={() => this.handleClickOpen()}> TODO </button> */}
        <Dialog open={this.state.open} onClose={() => {this.handleClose()}} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Import from data</DialogTitle>

          <DialogContent id="importDialog">
            <Typography gutterBottom>
              Data source {this.state.selected?.name}
            </Typography>
            <InputBase
              value={this.state.sourceUrl}
              onChange={(e) => this.sourceChanged(e)}
              placeholder="Input data source URL"
            />
            <Typography gutterBottom>
              List
            </Typography>
            <Autocomplete
              value={this.state.selected}
              onChange={(e, n) => {this.onSelectedChange(e, n)}}
              id="import-items-filter"
              options={this.state.items}
              getOptionLabel={(item: SourceItem) => item.name}
              renderInput={(params: any) => <TextField {...params} label="筛选" variant="outlined" />}
            />

            <DialogActions>
              <Button onClick={() => {this.handleClose()}} color="primary">
                Cancel
              </Button>
              <Button onClick={() => {this.handleClickConfirm()}} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </>
    )
  }

}


export {
  EditOptionsDialog, SearchDialog,
  FilterDialog, TuneDialog, SettingDialog,
  ImportDialog,
}
