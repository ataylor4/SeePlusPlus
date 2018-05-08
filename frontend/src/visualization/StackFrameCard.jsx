import React, { Component } from "react";
import PropTypes from "prop-types";
import { Rect, Text, Group } from "react-konva";

import VariableCard from "./VariableCard";
import VisualizationTool from "../utils/VisualizationTool";
import { StackFrameCard as VisualConstants } from "../utils/VisualConstants";

export default class StackFrameCard extends Component {
  static get propTypes() {
    return {
      traceStep: PropTypes.object.isRequired,
      stackFrame: PropTypes.object.isRequired,
      updateVisualization: PropTypes.func.isRequired,
      active: PropTypes.bool,
      x: PropTypes.number,
      y: PropTypes.number
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      expanded: this.props.active,
      prevActive: this.props.active,
      ...VisualizationTool.getStackFrameCardDimensions(this.props.stackFrame, this.props.active)
    };
  }

  componentWillReceiveProps({ stackFrame, active }) {
    if (this.state.prevActive === active) {
      this.setState({ ...VisualizationTool.getStackFrameCardDimensions(stackFrame, this.state.expanded) });
    } else {
      this.setState({
        expanded: active,
        prevActive: active,
        ...VisualizationTool.getStackFrameCardDimensions(stackFrame, active)
      });
    }
  }

  getOutline() {
    return (
      <Rect
        x={this.props.x}
        y={this.props.y}
        width={this.state.width}
        height={this.state.height}
        fill={VisualConstants.COLORS.BODY}
        stroke={VisualizationTool.getColor(this)}
        strokeWidth={VisualConstants.SIZING.OUTLINE_WIDTH}
        cornerRadius={VisualConstants.SIZING.CORNER_RADIUS}
      />
    );
  }

  getTitleBackground() {
    return (
      <Group>
        <Rect
          x={this.props.x}
          y={this.props.y}
          width={this.state.width}
          height={30}
          fill={VisualizationTool.getColor(this)}
          cornerRadius={VisualConstants.SIZING.CORNER_RADIUS}
        />
        <Rect
          x={this.props.x}
          y={this.props.y + 10}
          width={this.state.width}
          height={20}
          fill={VisualizationTool.getColor(this)}
        />
      </Group>
    );
  }

  getTitleText() {
    return (
      <Text
        text={this.props.stackFrame.funcName}
        x={this.props.x}
        y={this.props.y + 3}
        fontSize={VisualConstants.FONT.TITLE_SIZE}
        fontFamily={VisualConstants.FONT.FAMILY}
        align={VisualConstants.ALIGNMENT.TITLE}
        width={this.state.width}
        onClick={() => this.toggleOpen()}
      />
    );
  }

  getTitleSegment() {
    return (
      <Group>
        {this.getTitleBackground()}
        {this.getTitleText()}
      </Group>
    );
  }

  getLocalVariableNodes() {
    const nodesToLayout = this.props.stackFrame.getLocalVariables().map(v => {
      const component = <VariableCard key={v.getId()} variable={v} traceStep={this.props.traceStep} x={this.props.x + 40}
                                      y={this.props.y + 40} updateVisualization={this.props.updateVisualization}/>;
      return { ...VisualizationTool.getVariableCardDimensions(v), component };
    });
    return VisualizationTool.layoutNodes({
      nodes: nodesToLayout,
      origin: { x: this.props.x + 7, y: this.props.y + 40 },
      offset: { x: 0, y: 15 },
      traceStep: this.props.traceStep,
      layout: VisualizationTool.Layouts.COLUMN
    });
  }

  toggleOpen() {
    this.setState({
      expanded: !this.state.expanded,
      ...VisualizationTool.getStackFrameCardDimensions(this.props.stackFrame, !this.state.expanded)
    }, () => {
      VisualizationTool.clearRegisteredComponents();
      this.props.updateVisualization()
    });
  }

  render() {
    return (
      <Group draggable>
        {this.getOutline()}
        {this.getTitleSegment()}
        {this.state.expanded && this.getLocalVariableNodes()}
      </Group>
    );
  }
}
