"use client";

import { useState, useRef, useEffect } from "react";
import { countryCodes, type CountryCode } from "@/lib/country-codes";

interface PhoneInputProps {
  id: string;
  value: string;
  countryCode: string;
  onPhoneChange: (phone: string) => void;
  onCountryChange: (dial: string) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
}

export function PhoneInput({
  id,
  value,
  countryCode,
  onPhoneChange,
  onCountryChange,
  placeholder = "9766715768",
  required = false,
  maxLength = 15,
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected =
    countryCodes.find((c) => c.dial === countryCode) ?? countryCodes[0];

  const filtered = search
    ? countryCodes.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.dial.includes(search),
      )
    : countryCodes;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  function selectCountry(c: CountryCode) {
    onCountryChange(c.dial);
    setOpen(false);
    setSearch("");
  }

  return (
    <div className="contact-phone-input" ref={dropdownRef}>
      <button
        type="button"
        className="contact-phone-prefix"
        onClick={() => setOpen((o) => !o)}
        aria-label="Select country code"
        aria-expanded={open}
      >
        <span
          className="contact-phone-flag"
          role="img"
          aria-label={selected.name}
        >
          {selected.flag}
        </span>
        <span>{selected.dial}</span>
        <i className="fas fa-chevron-down contact-phone-arrow"></i>
      </button>

      {open && (
        <div className="country-code-dropdown">
          <div className="country-code-search-wrapper">
            <input
              ref={searchRef}
              type="text"
              className="country-code-search"
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <ul className="country-code-list" role="listbox">
            {filtered.map((c) => (
              <li
                key={c.code}
                role="option"
                aria-selected={c.dial === selected.dial}
                className={`country-code-option${c.dial === selected.dial ? " selected" : ""}`}
                onClick={() => selectCountry(c)}
              >
                <span className="country-code-option-flag">{c.flag}</span>
                <span className="country-code-option-name">{c.name}</span>
                <span className="country-code-option-dial">{c.dial}</span>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="country-code-no-result">No results found</li>
            )}
          </ul>
        </div>
      )}

      <input
        type="tel"
        id={id}
        required={required}
        value={value}
        onChange={(e) => {
          const val = e.target.value.replace(/[^0-9]/g, "").slice(0, maxLength);
          onPhoneChange(val);
        }}
        inputMode="numeric"
        maxLength={maxLength}
        placeholder={placeholder}
      />
    </div>
  );
}
