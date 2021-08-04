import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
`;

const StatefulButton = styled.button<{ isActive?: boolean }>`
  background-color: #f4fdff;
  border: 1px solid #0090a6;
  ${props => props.isActive &&`
    background-color: #bdf7ff;
  `}
`;

const Tab = styled(StatefulButton)`
  & + & {
    border-left: none;
  }
`;

const Column = styled.div`
  padding: 4px 8px;
  border: 1px solid #808080;
  white-space: nowrap;
  overflow-x: scroll;
  text-overflow: ellipsis;
`;

const CheckColumn = styled(Column)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 80px;
`;

const CheckBox = styled.div<{ isActive?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: #ffffff;
  border: 1px solid #005196;
  border-radius: 8px;
  & + & {
    border-left: none;
  }
  ${props => props.isActive &&`
    color: #ffffff;
    background-color: #008bff;
  `}
`;

const FileTitle = styled(Column)`
  flex: 0 0 240px;
`;

const FileType = styled(Column)`
  flex: 0 0 280px;
  border-left: none;
`;

export {
  Container,
  Row,
  StatefulButton,
  Tab,
  Column,
  CheckColumn,
  CheckBox,
  FileTitle,
  FileType,
};
