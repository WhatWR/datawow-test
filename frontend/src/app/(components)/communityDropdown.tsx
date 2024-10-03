"use client";
import React, { useState, useEffect } from 'react';
import styles from '@/app/(components)/styles/communityDropdown.module.css';
import Image from 'next/image';
import DropDownArrow from '@/app/(images)/down-arrow.png';
import Correct from '@/app/(images)/correct.png';
import axiosInstance from '@/app/(lib)/axiosInstance'; // Import axios instance

interface Community {
    id: number;
    name: string;
}

interface CommunityDropdownProps {
    selectedCommunity: number | null;
    onSelectCommunity: (id: number) => void;
}

const CommunityDropdown: React.FC<CommunityDropdownProps> = ({
                                                                 selectedCommunity,
                                                                 onSelectCommunity,
                                                             }) => {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    useEffect(() => {
        // Fetch communities from the API
        const fetchCommunities = async () => {
            try {
                const response = await axiosInstance.get<Community[]>('/community'); // API endpoint for communities
                setCommunities(response.data); // Set the fetched communities
            } catch (error) {
                console.error('Error fetching communities:', error);
            }
        };

        fetchCommunities(); // Call the function to fetch data
    }, []);

    const toggleDropdown = (): void => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleCommunitySelect = (community: Community): void => {
        onSelectCommunity(community.id);
        setIsDropdownOpen(false);
    };

    const getCommunityName = (id: number | null) => {
        const selected = communities.find((community) => community.id === id);
        return selected ? selected.name : 'Community';
    };

    return (
        <div className={styles.communityDropdown}>
            <div className={styles.dropdownHeader} onClick={toggleDropdown}>
                <span>{getCommunityName(selectedCommunity)}</span>
                <span>
                    <Image src={DropDownArrow} alt="dropdown-arrow" />
                </span>
            </div>
            {isDropdownOpen && (
                <ul className={styles.dropdownList}>
                    {communities.map((community) => (
                        <li
                            key={community.id}
                            onClick={() => handleCommunitySelect(community)}
                            className={selectedCommunity === community.id ? styles.selected : ''}
                        >
                            <span>{community.name}</span>
                            {selectedCommunity === community.id && (
                                <Image
                                    src={Correct}
                                    alt="selected"
                                    className={styles.correctIcon}
                                />
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CommunityDropdown;
