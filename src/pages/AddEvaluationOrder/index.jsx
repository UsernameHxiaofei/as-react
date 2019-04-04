/*
 create By wwj 2018-12-11
 */
// 引入组件
import React, { Component, Fragment } from 'react';
import AddEvaluationOrder from './Component/AddEvaluationOrder';
 
class AddEvaluation extends Component {

  render() {
    return (
      <Fragment>
         <AddEvaluationOrder />
      </Fragment>
    );
  };
};

export default AddEvaluation;
