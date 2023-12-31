import React, { Component } from 'react';

import { connect } from 'react-redux';

import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick'
// import css file


class Handbook extends Component {

    render() {  
        return (
            <div className='section-share section-handbook'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>Chuyên khoa phổ biến</span>
                        <button className='btn-section'>Xem thêm</button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.setting}>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook' ></div>
                                <div>Co xuong khop</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook' ></div>
                                <div >Co xuong khop</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook' ></div>
                                <div>Co xuong khop</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook' ></div>
                                <div>Co xuong khop</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook' ></div>
                                <div >Co xuong khop</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook' ></div>
                                <div>Co xuong khop</div>
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language:state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Handbook);
