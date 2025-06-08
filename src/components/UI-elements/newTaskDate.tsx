import React, { useState, useEffect } from "react";
import * as Popover from "@radix-ui/react-popover";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Icons from "./sidebarIcons";

interface DateProps {
	children: React.ReactNode;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onSelectDate: (date: Date | null) => void;
	selectedDate: Date | null;
}

const DatePopover: React.FC<DateProps> = ({
	children,
	isOpen,
	onOpenChange,
	onSelectDate,
	selectedDate,
}) => {
	const [internalDate, setInternalDate] = useState<Date | null>(selectedDate);

	useEffect(() => {
		setInternalDate(selectedDate);
	}, [selectedDate]);

	const handleDateChange = (date: Date | null) => {
		setInternalDate(date);
		onSelectDate(date);
		onOpenChange(false);
	};

	const handleSetToday = () => {
		const today = new Date();
		setInternalDate(today);
		onSelectDate(today);
		onOpenChange(false);
	};

	return (
		<Popover.Root open={isOpen} onOpenChange={onOpenChange}>
			<Popover.Trigger asChild>{children}</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content
					className='task-option-popover date-picker-variant'
					sideOffset={5}
					align='start'
				>
					<DatePicker
						selected={internalDate}
						onChange={handleDateChange}
						inline
						showMonthDropdown
						showYearDropdown
						dropdownMode='select'
						renderCustomHeader={({
							date,
							decreaseMonth,
							increaseMonth,
							prevMonthButtonDisabled,
							nextMonthButtonDisabled,
						}) => (
							<div className='react-datepicker__header--custom'>
								<button
									onClick={() => changeYear(date.getFullYear() - 1)}
									className='react-datepicker__navigation react-datepicker__navigation--year-previous'
									aria-label='Previous Year'
								>
									<Icons name='arrow_left_double' />
								</button>
								<button
									onClick={decreaseMonth}
									className='react-datepicker__navigation react-datepicker__navigation--previous'
									disabled={prevMonthButtonDisabled}
									aria-label='Previous Month'
								>
									<Icons name='arrow_left' />
								</button>

								{/* Current month and year display */}
								<span className='react-datepicker__current-month'>
									{new Date(date).toLocaleString("en-US", { month: "short", year: "numeric" })}
								</span>

								<button
									onClick={increaseMonth}
									className='react-datepicker__navigation react-datepicker__navigation--next'
									disabled={nextMonthButtonDisabled}
									aria-label='Next Month'
								>
									<Icons name='arrow_right' />
								</button>
								<button
									onClick={() => changeYear(date.getFullYear() + 1)} // Dummy changeYear for now
									className='react-datepicker__navigation react-datepicker__navigation--year-next'
									aria-label='Next Year'
								>
									<Icons name='arrow_right_double' />
								</button>
							</div>
						)}
					/>

					<div className='date-picker-footer'>
						<button className='date-picker-today-button' onClick={handleSetToday}>
							Today
						</button>
					</div>

					<Popover.Arrow className='popover-arrow' />
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
};

export default DatePopover;
