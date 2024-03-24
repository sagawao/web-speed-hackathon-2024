import {
  ArrowBack,
  Search,
  FavoriteBorder,
  Favorite,
  Close,
  NavigateNext,

} from '@mui/icons-material';

type Props = {
  color: string;
  height: number;
  type: 'ArrowBack' | 'Search' | 'FavoriteBorder' | 'Favorite' | 'Close' | 'NavigateNext';
  width: number;
};

export const SvgIcon: React.FC<Props> = ({ color, height, type, width }) => {
  const Icon = type === 'ArrowBack' ? ArrowBack :
    type === 'Search' ? Search :
      type === 'FavoriteBorder' ? FavoriteBorder :
        type === 'Favorite' ? Favorite :
          type === 'Close' ? Close :
            type === 'NavigateNext' ? NavigateNext :
              null;
  return Icon ? <Icon style={{ color, height, width }} /> : null;
};
