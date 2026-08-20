export type CarouselItemBounds = {
  id: string;
  left: number;
  width: number;
};

export function findCenteredItemId(viewportLeft: number, viewportWidth: number, items: CarouselItemBounds[]) {
  if (items.length === 0) return null;

  const viewportCenter = viewportLeft + viewportWidth / 2;
  return items.reduce((closest, item) => {
    const distance = Math.abs(item.left + item.width / 2 - viewportCenter);
    return distance < closest.distance ? { id: item.id, distance } : closest;
  }, { id: items[0].id, distance: Math.abs(items[0].left + items[0].width / 2 - viewportCenter) }).id;
}
