import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
`;

const Column = styled.div`
  padding: 4px 8px;
  border: 1px solid #808080;
  white-space: nowrap;
  overflow-x: scroll;
  text-overflow: ellipsis;
`;

const FileTitle = styled(Column)`
  flex: 0 0 240px;
`;

const FileType = styled(Column)`
  flex: 0 0 280px;
  border-left: none;
`;

export { Container, Row, Column, FileTitle, FileType };
