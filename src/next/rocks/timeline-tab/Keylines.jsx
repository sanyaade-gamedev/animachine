import React from 'react'
import Keyline from './Keyline'
import InlineEaseEditor from './inline-ease-editor/InlineEaseEditor'
import InlineEaseEditorStore from './inline-ease-editor/InlineEaseEditorStore'

export default class Keylines extends React.Component {
  constructor() {
    super()
    BETON.getRock('config', config => this.config = config)
    this.inlineEaseEditorStore = new InlineEaseEditorStore()
  }

  renderPointerLine() {
    const {timeline} = this.props
    const position = timeline.convertTimeToPosition(timeline.currentTime)
    const style = {
      position: 'absolute',
      transform: `translate(${position}px)`,
      left: 0,
      top: 0,
      width: 1,
      height: '100%',
      backgroundColor: '#FF4136',
    }
    return <div style={style}/>
  }

  render() {
    const {timeline}  = this.props
    const height = this.config.size
    const children = []
    var pos = 0

    const renderKeyline = model => {
      children.push(<Keyline
        timeline = {timeline}
        inlineEaseEditorStore = {this.inlineEaseEditorStore}
        style = {{left: 0, top: pos}}
        height = {height}
        model = {model}
        key = {model.modelId}/>)

      pos += height

      if (model.openInTimeline) {
        model.forEachParam(param => renderKeyline(param))
      }
    }

    timeline.forEachTrack(param => renderKeyline(param))

    return <div style={{position: 'relative'}}>
      {children}
      {this.renderPointerLine()}
      <InlineEaseEditor
        timeline = {timeline}
        store = {this.inlineEaseEditorStore}/>
    </div>
  }
}
