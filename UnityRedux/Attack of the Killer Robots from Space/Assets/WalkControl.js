#pragma strict

public var MovementImpulse : float;
public var FootLiftImpulse : float;
public var StepInterval : float;
public var Foot : FootResponder;
public var CameraSpringConstant : float;
public var WalkBobHeadTiltMaximumAngle : float;
public var WalkBobCycleInterval : float;
public var JumpImpulse : float;

private var RemainingTimeUntilNextStepIsAllowed : float;
private var RemainingTimeOfWalkBobCycle : float;
private var LiftedFootIndex : int = 1;
private var WasWalkingLastUpdate : boolean = false;
private var FakePosition : Vector3;

function Start () 
{
	RemainingTimeUntilNextStepIsAllowed = 0;
	RemainingTimeOfWalkBobCycle = 0;
	WasWalkingLastUpdate = false;
	FakePosition = transform.position;
}

function Update () 
{

	var justStartedWalking : boolean = false;
	
	RemainingTimeUntilNextStepIsAllowed -= Time.deltaTime;
	if(Foot.IsOnWalkableSurface)
	{
		if(RemainingTimeUntilNextStepIsAllowed < 0 && Foot.IsOnWalkableSurface)
		{
			var forwardImpulse = Input.GetAxis("Vertical") * MovementImpulse;
			var rightwardImpulse = Input.GetAxis("Horizontal") * MovementImpulse;
			if(rightwardImpulse != 0 || forwardImpulse != 0)
			{
				var impulse = Quaternion.AngleAxis(transform.localEulerAngles.y, Vector3.up) * Vector3(rightwardImpulse, FootLiftImpulse, forwardImpulse);
				Foot.rigidbody.AddForce(impulse, ForceMode.Impulse);
				justStartedWalking = !WasWalkingLastUpdate;
				WasWalkingLastUpdate = true;
				RemainingTimeUntilNextStepIsAllowed = StepInterval;
			}
			else WasWalkingLastUpdate = false;
		}
	
		if(Input.GetButtonDown("Jump"))
		{
			Foot.rigidbody.AddForce(0, JumpImpulse, 0, ForceMode.Impulse);
		}
	}
	
	RemainingTimeOfWalkBobCycle -= Time.deltaTime;
	
	if(WasWalkingLastUpdate && RemainingTimeOfWalkBobCycle < 0) 
	{
		LiftedFootIndex *= -1;
		RemainingTimeOfWalkBobCycle = WalkBobCycleInterval;
	}
	
	if(justStartedWalking)
	{
		RemainingTimeOfWalkBobCycle = WalkBobCycleInterval;
	}
	
	var interpolationFactor : float = Mathf.Sin(3.14159 * Mathf.Clamp(RemainingTimeOfWalkBobCycle, 0, WalkBobCycleInterval) / WalkBobCycleInterval);
	transform.localEulerAngles.z = LiftedFootIndex * WalkBobHeadTiltMaximumAngle * interpolationFactor;
	
	//Now we update the camera, but a bit delayed
	transform.position = Foot.rigidbody.position;
	/*var difference = Foot.rigidbody.position - transform.position;
	var magnitude = difference.magnitude;
	if(magnitude > 0.1)
	{
		//var movement : Vector3 = Vector3.Scale(difference, difference) * Time.deltaTime * CameraSpringConstant / magnitude;
		var movement : Vector3 = difference * Time.deltaTime;
		transform.position += movement;
	}*/
}