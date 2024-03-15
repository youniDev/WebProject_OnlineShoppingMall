// src/component/layout/Dropdown.jsx
import React, { useState } from "react";
import { NavDropdown } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const Dropdown = (props) => {
    const navigate = useNavigate();
    const [activeDropdown, setActiveDropdown] = useState(false);
    const { dropdown, userId } = props;

    const showDropdown = (dropdownId) => {
        setActiveDropdown(dropdownId);
    };

    const hideDropdown = () => {
        setActiveDropdown(false);
    };

    const handleItemClick = (category) => {
        const path = (activeDropdown === 'community' ? '/community' : '/category');

        navigate(`${path}/${category.replace(/\//g, '')}`, { state: { data: category, user: userId } });
    };

    return (
        <NavDropdown
            key={dropdown.id}
            title={dropdown.title}
            id={`collapsible-nav-dropdown-${dropdown.id}`}
            show={activeDropdown === dropdown.id}
            onMouseEnter={() => showDropdown(dropdown.id)}
            onMouseLeave={hideDropdown}
            onClick={() => {
                handleItemClick(dropdown.title)
            }}
        >
            <li className="text-center">
                {dropdown.items && dropdown.items.map((category) => (
                    <NavDropdown.Item
                        key={category}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleItemClick(category)
                        }}
                    >
                        {category}
                    </NavDropdown.Item>
                ))}
            </li>
        </NavDropdown>
    );
};

export default Dropdown;