import React from 'react'
import Draggable from 'react-draggable';
import CloseIcon from '@material-ui/icons/Close';

import { NodeType, CatType, Pos2d} from '../server/datatypes'
import { shortestString } from '../server/utils'

type infoBoardProps = {
  pos: Pos2d,
  node: NodeType,
  cats: Record<string, CatType>,
  close: () => void,
}

export default (props: infoBoardProps) => {
  const node = props.node
  const pos = props.pos
  let cat = props.cats[node.categorie]
  const boardStyle = {
    top: pos.y + "px",
    left: pos.x + "px",
  }
  const catStyle = 'color' in cat ? {color: cat.color} : {}
  return (
    <Draggable>
      <div className="infoBoard" style={boardStyle}>
        <CloseIcon className="closeButton" onClick={() => props.close()}/>
        <div className="title">
          <div className="name">
            {node.label}
          </div>
          <div className="categorie" style={catStyle}>
            {(cat != undefined) ? cat.label : ""}
          </div>
          <div className="describe">
            { shortestString(node.info, 80) }
          </div>
          {
            ('link' in node) && (node['link'] !== "") ?
            <a className="link" href={node.link}> Link </a> :
            null
          }
        </div>
      </div>
    </Draggable>
  )
}

