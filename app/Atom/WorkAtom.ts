import { atom } from "recoil";
import { ProjectResponseType } from "../Ults";

export const WorkPageDetailStatus = atom({
  key: 'WorkPageDetailStatus',
  default: 'NEW'
})

export const WorkPageDetailData = atom({
  key: 'WorkPageDetailData',
  default: {} as ProjectResponseType
})
