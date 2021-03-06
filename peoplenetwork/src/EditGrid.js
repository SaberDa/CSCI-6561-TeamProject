// Implement the Table style editor of nodes, edges and categories
//
// This file is copy then modified from devexetreme-reactive demo:
//   https://devexpress.github.io/devextreme-reactive/react/grid/demos/featured/data-editing/

import React from 'react';
import {
  SortingState, EditingState, PagingState, SummaryState,
  IntegratedPaging, IntegratedSorting,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table, TableHeaderRow, TableEditRow, TableEditColumn,
  PagingPanel, TableColumnReordering,
  TableFixedColumns, 
} from '@devexpress/dx-react-grid-material-ui';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
  lookupEditCell: {
    padding: theme.spacing(1),
  },
  dialog: {
    width: 'calc(100% - 16px)',
  },
  inputRoot: {
    width: '100%',
  },
  selectMenu: {
    position: 'absolute !important',
  },
});

const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: 'center' }}>
    <Button
      color="primary"
      onClick={onExecute}
      title="Create new row"
    >
      New
    </Button>
  </div>
);

const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Edit row">
    <EditIcon />
  </IconButton>
);

const DeleteButton = ({ onExecute }) => (
  <IconButton
    onClick={() => {
      // eslint-disable-next-line
      if (window.confirm('Are you sure you want to delete this row?')) {
        onExecute();
      }
    }}
    title="Delete row"
  >
    <DeleteIcon />
  </IconButton>
);

const CommitButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Save changes">
    <SaveIcon />
  </IconButton>
);

const CancelButton = ({ onExecute }) => (
  <IconButton color="secondary" onClick={onExecute} title="Cancel changes">
    <CancelIcon />
  </IconButton>
);

const commandComponents = {
  add: AddButton,
  edit: EditButton,
  delete: DeleteButton,
  commit: CommitButton,
  cancel: CancelButton,
};

const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];
  return (
    <CommandButton
      onExecute={onExecute}
    />
  );
};

const availableValues = {
  categorie: ["person", "organization"],
  direction: ["true", "false"]
};

const LookupEditCellBase = ({
  availableColumnValues, value, onValueChange, classes,
}) => (
  <TableCell
    className={classes.lookupEditCell}
  >
    <Select
      value={value}
      onChange={event => onValueChange(event.target.value)}
      MenuProps={{
        className: classes.selectMenu,
      }}
      input={(
        <Input
          classes={{ root: classes.inputRoot }}
        />
      )}
    >
      {availableColumnValues.map(item => (
        <MenuItem key={item} value={item}>
          {item}
        </MenuItem>
      ))}
    </Select>
  </TableCell>
);
export const LookupEditCell = withStyles(styles, { name: 'ControlledModeDemo' })(LookupEditCellBase);

const EditCell = (props) => {
  const { column } = props;
  const availableColumnValues = availableValues[column.name];
  if (availableColumnValues) {
    return <LookupEditCell {...props} availableColumnValues={availableColumnValues} />;
  }
  return <TableEditRow.Cell {...props} />;
};

const getRowId = row => row.id;

/**
 * Generate an Editable Grid object
 */
const createGrid = (colDef, getParentState, widthDef, colOrder, defaultDef, setParentState) => {

  class TheGrid extends React.Component {
    
    constructor(props) {
      super(props)
      this.state = {
        columns: colDef,
        rows: (typeof getParentState === "function") ? getParentState(props) : props[getParentState],
        tableColumnExtensions: widthDef,
        sorting: [],
        editingRowIds: [],
        addedRows: [],
        rowChanges: {},
        currentPage: 0,
        pageSize: 5,
        pageSizes: [5, 10, 0],
        columnOrder: colOrder,
        leftFixedColumns: [TableEditColumn.COLUMN_TYPE],
        totalSummaryItems: []
      }
    }

    changeAddedRows(value) {
      let defaultRow = {}
      for (const [k, v] of Object.entries(defaultDef)) {
        if (typeof v === "function") {
          defaultRow[k] = v(this.state.rows)
        } else {
          defaultRow[k] = v
        }
      }
      console.log(defaultRow)
      this.setState({
        addedRows: value.map(row => (Object.keys(row).length ? row : defaultRow))
      })
    }

    deleteRows(deletedIds) {
      const rowsForDelete = this.state.rows.slice();
      deletedIds.forEach((rowId) => {
        const index = rowsForDelete.findIndex(row => row.id === rowId);
        if (index > -1) {
          rowsForDelete.splice(index, 1);
        }
      });
      return rowsForDelete;
    }

    commitChanges({ added, changed, deleted }) {
      const rows = this.state.rows
      let changedRows;
      if (added) {
        const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
        changedRows = [
          ...rows,
          ...added.map((row, index) => ({
            id: startingAddedId + index,
            ...row,
          })),
        ];
      }
      if (changed) {
        changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
      }
      if (deleted) {
        changedRows = this.deleteRows(deleted);
      }
      this.setState({
        rows: changedRows
      })
      // change the state of parent component
      setParentState(this.props, changedRows)
    };

  /**
   * re-render rows when receive new props, see:
   *   https://stackoverflow.com/questions/41233458/react-child-component-not-updating-after-parent-state-change
   */
  componentWillReceiveProps(nextProps) {
    const newRows = (typeof getParentState === "function") ? getParentState(nextProps) : nextProps[getParentState]
    this.setState({ rows: newRows });  
  }

  render() {
    return (
      <Paper>
        <Grid
          rows={this.state.rows}
          columns={this.state.columns}
          getRowId={getRowId}
        >
          <SortingState
            sorting={this.state.sorting}
            onSortingChange={(s) => {this.setState({sorting: s})}}
          />
          <PagingState
            currentPage={this.state.currentPage}
            onCurrentPageChange={(c) => this.setState({currentPage: c})}
            pageSize={this.state.pageSize}
            onPageSizeChange={(s) => this.setState({pageSize: s})}
          />
          <EditingState
            editingRowIds={this.state.editingRowIds}
            onEditingRowIdsChange={(ids) => {this.setState({editingRowIds: ids})}}
            rowChanges={this.state.rowChanges}
            onRowChangesChange={(c) => {this.setState({rowChanges: c})}}
            addedRows={this.state.addedRows}
            onAddedRowsChange={this.changeAddedRows.bind(this)}
            onCommitChanges={this.commitChanges.bind(this)}
          />
          <SummaryState
            totalItems={this.state.totalSummaryItems}
          />

          <IntegratedSorting />
          <IntegratedPaging />

          <Table
            columnExtensions={this.state.tableColumnExtensions}
          />
          <TableColumnReordering
            order={this.state.columnOrder}
            onOrderChange={(c) => this.setState({columnOrder: c})}
          />
          <TableHeaderRow showSortingControls />
          <TableEditRow
            cellComponent={EditCell}
          />
          <TableEditColumn
            width={150}
            showAddCommand={!this.state.addedRows.length}
            showEditCommand
            showDeleteCommand
            commandComponent={Command}
          />
          <TableFixedColumns
            leftColumns={this.state.leftFixedColumns}
          />
          <PagingPanel
            pageSizes={this.state.pageSizes}
          />
        </Grid>
      </Paper>
    );
  }

  }

  return TheGrid

}

const NodeGrid = createGrid(
  [
    { name: 'id', title: 'ID' },
    { name: 'label', title: 'Label' },
    { name: 'categorie', title: 'Category' },
    { name: 'info', title: 'Info' },
    { name: 'image', title: 'Image' },
    { name: 'link', title: 'Link' },
  ],
  "nodes",
  [
    { columnName: 'id', width: 80 },
    { columnName: 'label', width: 100 },
    { columnName: 'categorie', width: 100},
    { columnName: 'info', width: 300 },
    { columnName: 'image', width: 200 },
    { columnName: 'link', width: 200 },
  ],
  ['id', 'label', 'categorie', 'info', 'image', 'link'],
  {
    id: (rows) => (rows.length > 0) ? Math.max(...rows.map((r) => r.id)) + 1 : 0,
    label: "",
    categorie: availableValues.categorie[0],
    info: "",
    image: "",
    link: ""
  },
  (props, changedRows) => {props.setNodes(changedRows.map((r) => {return {...r, id: parseInt(String(r.id))}}))}
)

const reprEdges = (edges) => edges.map((e_) => {
  let e = Object.assign({}, e_)
  e.direction = String(e.direction)
  return e
})

const recoverEdges = (rows) => rows.map((e_) => {
  let e = Object.assign({}, e_)
  e.id = parseInt(String(e.id))
  e.direction = (e.direction === "false") ? false : true
  return e
})

const EdgeGrid = createGrid(
  [
    { name: 'id', title: 'ID' },
    { name: 'from', title: 'from' },
    { name: 'to', title: 'to' },
    { name: 'label', title: 'Label' },
    { name: 'direction', title: 'Direction?' }
  ],
  (props) => reprEdges(props.edges),
  [
    { columnName: 'id', width: 100 },
    { columnName: 'from', width: 100 },
    { columnName: 'to', width: 100},
    { columnName: 'label', width: 120 },
    { columnName: 'direction', width: 100 },
  ],
  ['id', 'from', 'to', 'label', 'direction'],
  {
    id: (rows) => (rows.length > 0) ? Math.max(...rows.map((r) => r.id)) + 1 : 0,
    label: "",
    direction: availableValues.direction[0],
    info: "",
    image: "",
    link: ""
  },
  (props, changedRows) => {props.setEdges(recoverEdges(changedRows))}
)

const reprCats = (cats) => {
  let rows = []
  for (const [k, v] of Object.entries(cats)) {
    let row = Object.assign({id: k}, v)
    rows.push(row)
  }
  return rows
}

const recoverCats = (rows) => {
  let cats = {}
  for (const r of rows) {
    let v = Object.assign({}, r)
    delete v.id
    cats[r.id] = v
  }
  return cats
}

const CatGrid = createGrid(
  [
    { name: 'id', title: 'ID' },
    { name: 'label', title: 'Label' },
    { name: 'color', title: 'Color' }
  ],
  (props) => {
    const cats = props.cats
    availableValues.categorie = Object.keys(cats)
    return reprCats(cats)
  },
  [
    { columnName: 'id', width: 200 },
    { columnName: 'label', width: 200 },
    { columnName: 'color', width: 200},
  ],
  ['id', 'label', 'color'],
  {
    id: "",
    label: "",
    color: "#aaaaaa"
  },
  (props, changedRows) => {
    availableValues.categorie = changedRows.map((r) => r.id)
    props.setCats(recoverCats(changedRows))
  }
)

export { NodeGrid, EdgeGrid, CatGrid }
