import React from 'react';
import PropTypes from 'prop-types';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const CryptoCard = ({ icon, variation }) => {
    const isPositive = variation >= 0;

    return (
        <div style={styles.card}>
            <div style={styles.icon}>{icon}</div>
            <div style={styles.variation}>
                {isPositive ? (
                    <FaArrowUp style={{ color: 'green' }} />
                ) : (
                    <FaArrowDown style={{ color: 'red' }} />
                )}
                <span style={{ color: isPositive ? 'green' : 'red' }}>
                    {variation.toFixed(2)}%
                </span>
            </div>
        </div>
    );
};

CryptoCard.propTypes = {
    icon: PropTypes.element.isRequired,
    variation: PropTypes.number.isRequired,
};

const styles = {
    card: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        borderRadius: '5px',
        width: '100%',
        height: '100%',
    },
    icon: {
        marginRight: '10px',
    },
    variation: {
        display: 'flex',
        alignItems: 'center',
    },
};

export default CryptoCard;