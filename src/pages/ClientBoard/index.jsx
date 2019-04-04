import React, { Component } from 'react';
import Header from './components/Header';
import Footer from './components/Foot';
import LeftTable from './components/LeftTable';
import RightTable from './components/RigntTable';

class ClientBoard extends Component {
  render() {
    return (
      <div>
        <p className='list-page_title'>客户看版</p>
        <Header />
        <div style={{ display: 'flex' }}>
          <div style={{ flexGrow: '5' }}>
            <LeftTable />
          </div>
          <div style={{ flexGrow: '2', marginLeft: '20px', backgroundColor: '#f2f2f2' }}>
            <RightTable />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
export default ClientBoard;
