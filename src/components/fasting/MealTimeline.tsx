import { MealCard, type MealStatus } from "./MealCard";
import { TimelineConnector } from "./TimelineConnector";
import breakfastImg from "@/assets/breakfast.jpg";
import lunchImg from "@/assets/lunch.jpg";
import dinnerImg from "@/assets/dinner.jpg";

interface MealData {
  status: MealStatus;
  time?: string;
  foodName?: string;
  calories?: number;
  tags?: string[];
}

interface MealTimelineProps {
  breakfast: MealData;
  lunch: MealData;
  dinner: MealData;
}

export function MealTimeline({ breakfast, lunch, dinner }: MealTimelineProps) {
  return (
    <div className="space-y-0">
      {/* 早餐 */}
      <MealCard
        type="breakfast"
        status={breakfast.status}
        time={breakfast.time}
        foodName={breakfast.foodName}
        calories={breakfast.calories}
        imageUrl={breakfast.status === "recorded" ? breakfastImg : undefined}
        tags={breakfast.tags}
      />

      {/* 连接线 早餐->午餐 */}
      <TimelineConnector
        fromType="breakfast"
        toType="lunch"
        fromStatus={breakfast.status}
        toStatus={lunch.status}
      />

      {/* 午餐 */}
      <MealCard
        type="lunch"
        status={lunch.status}
        time={lunch.time}
        foodName={lunch.foodName}
        calories={lunch.calories}
        imageUrl={lunch.status === "recorded" ? lunchImg : undefined}
        tags={lunch.tags}
      />

      {/* 连接线 午餐->晚餐 */}
      <TimelineConnector
        fromType="lunch"
        toType="dinner"
        fromStatus={lunch.status}
        toStatus={dinner.status}
      />

      {/* 晚餐 */}
      <MealCard
        type="dinner"
        status={dinner.status}
        time={dinner.time}
        foodName={dinner.foodName}
        calories={dinner.calories}
        imageUrl={dinner.status === "recorded" ? dinnerImg : undefined}
        tags={dinner.tags}
      />
    </div>
  );
}
