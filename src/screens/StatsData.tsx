import {readRecords, readTodayPomodoro} from '../database';

export const statsData = async () => {
    try {
        const pomodoroData: {id: number; name: string; date: string}[] =
            await readRecords('pomodoro');
        return pomodoroData;
    } catch {
        console.log('Error reading from Pomodoro table:', Error);
        return [];
    }
};

export interface ProcessedRecord {
    id: number;
    name: string;
    date: Date; // Change the type to Date
}

const parseDateStringToDate = (dateString: string): Date => {
    const dateComponents = dateString.split(/[\s,/:]+/);

    return new Date(
        parseInt(dateComponents[2]), // Year
        parseInt(dateComponents[0]) - 1, // Month (0-based)
        parseInt(dateComponents[1]), // Day
        parseInt(dateComponents[3]), // Hours
        parseInt(dateComponents[4]), // Minutes
        parseInt(dateComponents[5]), // Seconds
    );
};

const filterRecordsByDateRange = (
    data: {id: number; name: string; date: string}[],
    startDate: Date,
    endDate: Date,
): ProcessedRecord[] => {
    return data
        .map(record => ({
            id: record.id,
            name: record.name,
            date: parseDateStringToDate(record.date),
        }))
        .filter(record => {
            return record.date >= startDate && record.date < endDate;
        });
};

export const processAllData = async (): Promise<ProcessedRecord[]> => {
    const data = await statsData();
    return data.map(record => ({
        id: record.id,
        name: record.name,
        date: parseDateStringToDate(record.date),
    }));
};
export const processTodayData = async (): Promise<ProcessedRecord[]> => {
    const data = await statsData();
    const today = new Date();
    const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
    );
    const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1,
    );
    const todayData = filterRecordsByDateRange(data, startOfDay, endOfDay);
    //console.log('process today data: ', todayData);
    return todayData;
};

export const processWeekData = async (): Promise<ProcessedRecord[]> => {
    const data = await statsData();
    const today = new Date();
    const startOfLastWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 6,
    );
    const weekData = filterRecordsByDateRange(data, startOfLastWeek, today);
    return weekData;
};

export const processMonthData = async (): Promise<ProcessedRecord[]> => {
    const data = await statsData();
    const today = new Date();
    const startOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        today.getDate(),
    );
    const monthData = filterRecordsByDateRange(data, startOfLastMonth, today);
    return monthData;
};

interface GoalChartData {
  labels: string[];
  data: number[];
}

export const processGoalData = async (): Promise<{labels: string[], data: number[]}> => {
  const taskProgress = new Map<string, number>();
  const pomodorosData: { id: number; name: string; date: string }[] =
    await readTodayPomodoro();

  pomodorosData.forEach(data => {
    const currentProgress = taskProgress.get(data.name) || 0;
    taskProgress.set(data.name, currentProgress + 1);
  });

  const taskNames: { id: number; name: string; goal: number }[] =
    await readRecords('taskName');

  const labels: string[] = [];
  const data: number[] = [];

  taskNames.forEach(task => {
    const progress = taskProgress.get(task.name) || 0;
    const goal = task.goal;
    // Check if the goal is a valid number before calculating the percentage
    if (!isNaN(goal) && goal !== 0) {
      const percentage = progress / goal;
      labels.push(task.name);
      data.push(percentage);
    }
  });

  return { labels, data };
};
