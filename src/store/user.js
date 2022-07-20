import step from "element-ui/packages/step";

const state = {

    menuList: [],
    permList: [],
    hasRoutes: false,
    editableTabsValue: 'BackNavIndex',
    editableTabs: [{
        title: '首页',
        name: 'BackNavIndex',
    }],
    userInfo:JSON.parse(sessionStorage.getItem("loginUserInfo")) || {},
    activePage:'1',
    activeStep:0,
    checkUser:{
        username:'',
        phone:'',
        newPass:'',
        code:'',
        key:''
    },
    rePassDialogVisible:false,
    brandName:[],
    brandCount: [],
    rentCount: [],
    userSum:0,
    bikeSum:0,
    profit:0.0,
}
const mutations = {
    SET_TOKEN(state, token){
        state.token = token;
        sessionStorage.setItem('token',token);
    },
    resetState(state) {
        state.menuList = [];
        state.permList = [];
        state.hasRoutes = false;
        state.editableTabsValue = 'BackNavIndex';
        state.editableTabs = [{
            title: '首页',
            name: 'BackNavIndex',
        }];
        state.userInfo = {};
    },
    changeRouteStatus(state, hasRoutes) {
        state.hasRoutes = hasRoutes
        sessionStorage.setItem("hasRoutes", hasRoutes)
    },
    setMenuList(state, menus) {
        state.menuList = menus
    },
    setPermList(state, authoritys) {
        state.permList = authoritys
    },
    addTab(state,tab){
        let index = state.editableTabs.findIndex(e => e.name === tab.name)
        if (index === -1){
            state.editableTabs.push({
                title:tab.title,
                name:tab.name
            });
        }
        state.editableTabsValue = tab.name
    },
    setUserInfo(state,userInfo){
        state.userInfo = userInfo;
        sessionStorage.setItem("loginUserInfo",JSON.stringify(userInfo));
    },
    setActivePage(state,activePage){
        state.activePage = activePage
    },
    setActiveStep(state,activeStep){
        state.activeStep = activeStep
    },
    next(state,activeStep) {
        if (state.activeStep === 0){
            state.activeStep = activeStep;
        }else if (state.activeStep === 1){
            state.activeStep = activeStep;
        }else if(state.activeStep === 2){
            state.activeStep = activeStep;
        }else if (state.activeStep === 3){
            state.activeStep = activeStep;
        }
    },
    setRePassDialogVisible(state,rePassDialogVisible){
        state.rePassDialogVisible = rePassDialogVisible;
    },
    saveBrandName(state,brandName){
        state.brandName = brandName;
    },
    saveBrandCount(state,brandCount){
        state.brandCount = brandCount;
    },
    saveRentCount(state,rentCount){
        state.rentCount = rentCount;
    },
    saveUserSum(state,userSum){
        state.userSum = userSum;
    },
    saveBikeSum(state,bikeSum){
        state.bikeSum = bikeSum;
    },
    saveProfit(state,profit){
        state.profit = profit
    }
}

const actions = {}
const getters = {}


export default {
    state,
    mutations,
    actions,
    getters
}