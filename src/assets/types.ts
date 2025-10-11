export interface Deck {
  DeckId: number;
  UserId: number;
  Title: string;
  Length: number;
  CreatedAt: Date;
}

export interface Card {
  CardId: number;
  DeckId: number;
  Position: number;
  Front: string;
  Back: string;
}
