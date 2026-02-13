import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCoinsList } from '../../services/api';
import { CoinListItem } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './CoinSearch.module.css';

interface CoinSearchProps {
  selectedCoin: string;
  onCoinSelect: (coinId: string, coinName: string, coinSymbol: string) => void;
}

export const CoinSearch = ({ selectedCoin, onCoinSelect }: CoinSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCoins, setFilteredCoins] = useState<CoinListItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all coins
  const { data: coins, isLoading } = useQuery({
    queryKey: ['coins-list'],
    queryFn: fetchCoinsList,
    staleTime: 24 * 60 * 60 * 1000,
  });

  // Filter coins based on search term
  useEffect(() => {
    if (!coins || !searchTerm) {
      setFilteredCoins([]);
      setSelectedIndex(-1);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = coins
      .filter(
        (coin) =>
          coin.name.toLowerCase().includes(term) ||
          coin.symbol.toLowerCase().includes(term) ||
          coin.id.toLowerCase().includes(term)
      )
      .slice(0, 10);

    setFilteredCoins(filtered);
    setSelectedIndex(-1);
  }, [searchTerm, coins]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && dropdownRef.current) {
      const items = dropdownRef.current.querySelectorAll('[role="option"]');
      const selectedItem = items[selectedIndex] as HTMLElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const handleSelect = (coin: CoinListItem) => {
    onCoinSelect(coin.id, coin.name, coin.symbol);
    setSearchTerm('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredCoins.length === 0) {
      if (e.key === 'ArrowDown' && searchTerm) {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < filteredCoins.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredCoins[selectedIndex]) {
          handleSelect(filteredCoins[selectedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;

      case 'Tab':
        // Allow default tab behavior but close dropdown
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const currentCoinName = coins?.find((c) => c.id === selectedCoin)?.name || 'Bitcoin';

  return (
    <div className={styles.container} ref={dropdownRef}>
      <div className={styles.searchBox}>
        <label htmlFor="coin-search" className={styles.srOnly}>
          Search for cryptocurrency
        </label>
        <input
          id="coin-search"
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder={`Search cryptocurrency... (Current: ${currentCoinName})`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => searchTerm && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="coin-search-listbox"
          aria-activedescendant={
            selectedIndex >= 0 ? `coin-option-${selectedIndex}` : undefined
          }
          aria-autocomplete="list"
        />
        <span className={styles.icon} aria-hidden="true">
          <FontAwesomeIcon icon={faSearch} />
        </span>
      </div>

      {isOpen && searchTerm && (
        <div 
          id="coin-search-listbox"
          className={styles.dropdown}
          role="listbox"
          aria-label="Cryptocurrency results"
        >
          {filteredCoins.length === 0 ? (
            <div className={styles.noResults} role="status">
              No cryptocurrencies found
            </div>
          ) : (
            filteredCoins.map((coin, index) => (
              <div
                key={coin.id}
                id={`coin-option-${index}`}
                className={`${styles.item} ${
                  index === selectedIndex ? styles.itemSelected : ''
                }`}
                onClick={() => handleSelect(coin)}
                onMouseEnter={() => setSelectedIndex(index)}
                role="option"
                aria-selected={index === selectedIndex}
                tabIndex={-1}
              >
                <div className={styles.coinInfo}>
                  <span className={styles.coinName}>{coin.name}</span>
                  <span className={styles.coinSymbol}>{coin.symbol.toUpperCase()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};